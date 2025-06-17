import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListingDetailsComponent } from './features/listings/pages/listing-details/listing-details.component';
import { RoomDetailsComponent } from './features/rooms/pages/room-details/room-details.component';

// const routes: Routes = [
//   {
//     path: ':locale',
//     children: [
//       { path: 'listing/:id', component: ListingDetailsComponent },
//       { path: 'ar/listing/:id', component: ListingDetailsComponent },
//       { path: 'room/:id', component: RoomDetailsComponent }
//     ]
//   },
//   { path: '', redirectTo: 'ar', pathMatch: 'full' },
// ];

const routes: Routes = [
  { path: 'listing/:id', component: ListingDetailsComponent },
  // { path: 'ar/listing/:id', component: ListingDetailsComponent },
  { path: 'room/:id', component: RoomDetailsComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
