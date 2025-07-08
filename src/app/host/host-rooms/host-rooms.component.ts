import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HostRoomService } from '../services/HostRoom.service';
import { HostRoomDto } from '../../core/models/room-details.model';
import { HttpClient } from '@angular/common/http';

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
  editForm: Partial<HostRoomDto> = { beds: [] };
  totalCount = 0;
  page = 1;
  pageSize = 5;
  searchTerm: string = '';
  roomPhotoFiles: File[][] = [];
  bedPhotoFiles: { [index: number]: File[] } = {};
// @ViewChild('editRoomForm') editFormRef!: NgForm;
@ViewChild('editRoomForm', { static: false }) editFormRef!: NgForm;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: HostRoomService,
    private toastr: ToastrService,
    private http: HttpClient
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

  onBedPhotoFilesChange(event: Event, i: number): void {
  const input = event.target as HTMLInputElement;
  this.bedPhotoFiles = this.bedPhotoFiles || [];
  this.bedPhotoFiles[i] = input.files ? Array.from(input.files) : [];
}

onRoomPhotosSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const files = input.files ? Array.from(input.files) : [];
  this.roomPhotoFiles = [files]; // only one group of files
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

uploadRoomPhotos(): void {
  if (!this.roomPhotoFiles[0] || this.roomPhotoFiles[0].length === 0) return;

  const formData = new FormData();
  this.roomPhotoFiles[0].forEach(file => formData.append('roomPhotos', file));

  this.http.post<string[]>('https://localhost:7188/api/upload/upload-room', formData).subscribe({
    next: (urls) => {
      console.log('Returned URLs:', urls);
      if (!this.editForm.photoUrls) {
        this.editForm.photoUrls = [];
      }
      this.editForm.photoUrls.push(...urls);
      this.roomPhotoFiles = []; // Clear after upload
      this.toastr.success('Room photos uploaded');
    },
    error: () => this.toastr.error('Room photo upload failed')
  });
}



  uploadBedPhotos(bedIndex: number): void {
    const files = this.bedPhotoFiles[bedIndex];
    if (!files || files.length === 0) return;

    const formData = new FormData();
    files.forEach(file => formData.append('bedPhotos', file));

    this.http.post<string[]>('https://localhost:7188/api/upload/upload-bed', formData).subscribe({
      next: (urls) => {
        if (!this.editForm.beds![bedIndex].bedPhotos) this.editForm.beds![bedIndex].bedPhotos = [];
        this.editForm.beds![bedIndex].bedPhotos!.push(...urls);
        this.bedPhotoFiles[bedIndex] = [];
        this.toastr.success(`Photos for Bed ${bedIndex + 1} uploaded`);
      },
      error: () => this.toastr.error('Bed photo upload failed')
    });
  }

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
          this.loadRooms();
        },
        error: () => this.toastr.error('Failed to delete room')
      });
    }
  }

  startEdit(room: HostRoomDto): void {
    this.editRoom = { ...room };
    this.editForm = {
      ...room,
      photoUrls: [...(room.photoUrls || [])],
      beds: room.beds.map(b => ({ ...b, bedPhotos: [...(b.bedPhotos || [])] }))
    };

    setTimeout(() => {
    console.log('Form reference after view init:', this.editFormRef);
  });

  }
  

  cancelEdit(): void {
    this.editRoom = null;
    this.editForm = {};
  }

saveEdit(): void {
  console.log('✅ Submitting room update:', this.editForm);

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


