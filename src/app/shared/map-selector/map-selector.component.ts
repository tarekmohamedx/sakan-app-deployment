import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-map-selector',
  standalone: true,
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css'],
})
export class MapSelectorComponentt implements AfterViewInit {
  private map: any;
  private marker: L.Marker | null = null;

  @Output() coordsSelected = new EventEmitter<{ lat: number; lng: number }>();

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [30.0444, 31.2357], // Cairo
      zoom: 6,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // 🔁 Remove old marker if it exists
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }

      // 📍 Add new marker
      this.marker = L.marker([lat, lng]).addTo(this.map);

      // 📤 Emit selected coords
      this.coordsSelected.emit({ lat, lng });
    });
  }

  // ✨ New method to clear the marker externally (e.g., after form submit)
  clearMarker(): void {
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
    }
  }
}
