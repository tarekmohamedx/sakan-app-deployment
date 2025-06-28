import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-map-selector',
  standalone: true,
  template: `
    <div style="height: 300px; background: lightgray;">
      <p>🗺️ Map Placeholder – Click to Select Coords</p>
      <button (click)="selectMockCoords()">Select Cairo</button>
    </div>
  `,
})
export class MapSelectorComponent {
  @Output() coordsSelected = new EventEmitter<{ lat: number; lng: number }>();

  selectMockCoords() {
    // mock coords for Cairo
    this.coordsSelected.emit({ lat: 30.033333, lng: 31.233334 });
  }
}
