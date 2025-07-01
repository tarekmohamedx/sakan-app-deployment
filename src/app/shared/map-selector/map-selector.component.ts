import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-map-selector',
  standalone: true,
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.css'],
})
export class MapSelectorComponent implements AfterViewInit {
  private map: any;
  @Output() coordsSelected = new EventEmitter<{ lat: number; lng: number }>();

  ngAfterViewInit(): void {
    this.map = L.map('map', {
      center: [30.0444, 31.2357], // Default: Cairo
      zoom: 6,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      this.coordsSelected.emit({ lat, lng });

      L.marker([lat, lng]).addTo(this.map); // optional marker
    });
  }
}
