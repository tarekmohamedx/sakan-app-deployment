import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HostRoomService } from '../services/HostRoom.service';
import { HostRoomDto } from '../../core/models/room-details.model';

@Component({
  selector: 'app-host-rooms',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './host-rooms.component.html',
  styleUrls: ['./host-rooms.component.css']
})
export class HostRoomsComponent implements OnInit {
  rooms: HostRoomDto[] = [];
  listingId!: number;
  editRoom: HostRoomDto | null = null;
  editForm: Partial<HostRoomDto> = {beds: []};
  totalCount = 0;
  page = 1;
  pageSize = 5;
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: HostRoomService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.listingId = +this.route.snapshot.paramMap.get('listingId')!;
    this.loadRooms();
  }

loadRooms(): void {
  this.roomService.getRoomsByListingId(this.listingId, this.page, this.pageSize, this.searchTerm).subscribe({
    next: res => {
      this.rooms = res.rooms;
      this.totalCount = res.totalCount;
    },
    error: () => this.toastr.error('Failed to load rooms')
  });
}

onSearch(): void {
  this.page = 1;
  this.loadRooms();
}

viewRoom(id: number): void {
    this.router.navigate(['/room', id]);
  }


  addBed() {
  this.editForm.beds!.push({
    id: null,
    label: '',
    type: '',
    price: 0,
    isAvailable: true,
    bedPhotos: []
  });
}

removeBed(index: number) {
  this.editForm.beds!.splice(index, 1);
}




  // loadRooms(): void {
  //   this.roomService.getRoomsByListingId(this.listingId).subscribe({
  //     next: (data) => this.rooms = data,
  //     error: () => this.toastr.error('Failed to load rooms')
  //   });
  // }

    nextPage() {
    if (this.page * this.pageSize < this.totalCount) {
      this.page++;
      this.loadRooms();
    }
  }

    prevPage() {
      if (this.page > 1) {
        this.page--;
        this.loadRooms();
      }
    }

    get totalPages(): number {
      return Math.ceil(this.totalCount / this.pageSize);
    }

  deleteRoom(id: number): void {
    if (confirm('Are you sure you want to archive this room?')) {
      this.roomService.deleteRoom(id).subscribe({
        next: () => {
          this.toastr.success('Room deleted successfully (soft delete)');
          this.loadRooms(); // refresh list
        },
        error: () => this.toastr.error('Failed to delete room')
      });
    }
  }


    startEdit(room: HostRoomDto): void {
      this.editRoom = { ...room };
      this.editForm = {
        ...room,
        beds: room.beds.map(b => ({ ...b }))
      };
    }


    cancelEdit(): void {
      this.editRoom = null;
      this.editForm = {};
    }

    saveEdit(): void {
      if (!this.editRoom) return;

      this.roomService.updateRoom(this.editRoom.id, this.editForm).subscribe({
        next: () => {
          this.toastr.success('Room updated successfully');
          this.editRoom = null;
          this.loadRooms();
        },
        error: () => this.toastr.error('Failed to update room')
      });
    }

}
