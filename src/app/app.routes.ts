import { Routes } from '@angular/router';
import { RegisterComponent } from '../app/features/auth/components/register/register.component';
import { LoginComponent } from '../app/features/auth/components/login/login.component';
import { HometestComponent } from './hometest/hometest.component';
import { ListingDetailsComponent } from './features/listings/pages/listing-details/listing-details.component';
import { RoomDetailsComponent } from './features/rooms/pages/room-details/room-details.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { ChatComponent } from './features/chat/chat.component';
import { CallbackComponent } from './callback/callback.component';
import { HostLayoutComponent } from './host/host-layout/host-layout.component';
import { DashboardComponent } from './host/dashboard/dashboard.component';
import { HostListingsComponent } from './host/host-listings/host-listings.component';
import { EditHostListingComponent } from './host/edit-host-listings/edit-host-listings.component';
import path from 'path';
import { AddApartmentComponent } from './features/listings/components/add-apartment/add-apartment.component';

export const routes: Routes = [
  {path  : '', redirectTo: 'host', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'listing/:id', component:ListingDetailsComponent},
  { path: 'room/:id', component:RoomDetailsComponent},
  { path: 'chat', component: ChatComponent },
  { path: 'host', component: HostLayoutComponent, children: [
    {path : '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'listings', component: HostListingsComponent },
    {path:'addapartment' , component:AddApartmentComponent},
    { path: 'editlisting/:id', component: EditHostListingComponent },
    { path: 'chat', component: ChatComponent },
  ]},
  { path: '**', component: NotfoundComponent },
  { path: 'signin-google', component: CallbackComponent },
];
