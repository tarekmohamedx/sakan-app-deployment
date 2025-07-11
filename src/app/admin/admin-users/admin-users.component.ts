import { Component, OnInit } from '@angular/core';
import { AdminUsersService, AdminUserDto } from '../services/admin-users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: AdminUserDto[] = [];
  filteredUsers: AdminUserDto[] = [];
  searchTerm = '';
  selectedRole: 'host' | 'guest' = 'host';
  editUser: AdminUserDto | null = null;
  editId='';
  editUserName = '';
  editEmail = '';
  loading = false;

  constructor(private adminUsersService: AdminUsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    const obs = this.selectedRole === 'host' ? this.adminUsersService.getHosts() : this.adminUsersService.getGuests();
    obs.subscribe({
      next: users => {
        console.log('Users from API:', users);
        this.users = users;
        this.applySearch();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applySearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.userName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  onSearchChange(): void {
    this.applySearch();
  }

  switchRole(role: 'host' | 'guest'): void {
    this.selectedRole = role;
    this.editUser = null;
    this.loadUsers();
  }

  startEdit(user: AdminUserDto): void {
    this.editUser = { ...user };
    this.editId = user.id;
    this.editUserName = user.userName;
    this.editEmail = user.email;
  }

  saveEdit(): void {
    if (!this.editUser) return;
    const userId = this.editUser.id;
    this.adminUsersService.updateUser(userId, { id: this.editId, userName: this.editUserName, email: this.editEmail }).subscribe({
      next: () => {
        this.editUser = null;
        this.loadUsers();
      }
    });
  }

  cancelEdit(): void {
    this.editUser = null;
  }

  deleteUser(user: AdminUserDto): void {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const userId = user.id;
    this.adminUsersService.deleteUser(userId).subscribe({
      next: () => this.loadUsers()
    });
  }
}
