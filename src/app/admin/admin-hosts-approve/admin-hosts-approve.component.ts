import { Component, OnInit } from '@angular/core';
import { AdminHostApproveService, AdminHost, AdminHostApprovalDto } from '../services/admin-hostApprove.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-hosts-approve',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-hosts-approve.component.html',
  styleUrl: './admin-hosts-approve.component.css'
})
export class AdminHostsApproveComponent implements OnInit {
  hosts: AdminHost[] = [];
  filteredHosts: AdminHost[] = [];
  pagedHosts: AdminHost[] = [];

  searchTerm = '';
  isLoading = false;

  // Pagination
  currentPage = 1;
  pageSize = 8;
  totalPages = 1;

  constructor(private adminService: AdminHostApproveService, private router: Router) {}

  ngOnInit(): void {
    this.loadHosts();
  }

  loadHosts(): void {
    this.isLoading = true;
    this.adminService.getHosts().subscribe({
      next: (data: AdminHost[]) => {
        this.hosts = data;
        this.filterHosts();
        this.isLoading = false;
      },
      error: () => {
        Swal.fire('Error', 'Failed to load hosts.', 'error');
        this.isLoading = false;
      }
    });
  }

  filterHosts(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredHosts = this.hosts.filter(h =>
      h.userName.toLowerCase().includes(term) || h.email.toLowerCase().includes(term) || h.hostVerificationStatus.toLowerCase().includes(term)
    );
    this.currentPage = 1;
    this.updatePagedHosts();
  }

  updatePagedHosts(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedHosts = this.filteredHosts.slice(start, end);
    this.totalPages = Math.ceil(this.filteredHosts.length / this.pageSize);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedHosts();
  }

  totalPagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  handleAction(host: AdminHost, action: 'approve' | 'reject') {
    const dto: AdminHostApprovalDto = {
      userId: host.id,
      action: action
    };

    this.adminService.approveOrRejectHost(dto).subscribe({
      next: (res: any) => {
        Swal.fire('Success', res.message, 'success');
        this.loadHosts();
      },
      error: () => {
        Swal.fire('Error', `Failed to ${action} host.`, 'error');
      }
    });
  }
}

