import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HometestComponent } from './hometest/hometest.component';
import { ListingDetailsComponent } from './features/listings/pages/listing-details/listing-details.component';
import { RoomDetailsComponent } from './features/rooms/pages/room-details/room-details.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { ChatComponent } from './features/chat/chat.component';
import { CallbackComponent } from './callback/callback.component';
import { HostListingsComponent } from './features/host/host-listings/host-listings.component';
import { EditHostListingComponent } from './features/host/edit-host-listings/edit-host-listings.component';
import { HostLayoutComponent } from './features/host/host-layout/host-layout.component';


export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'listing/:id', component:ListingDetailsComponent},
  { path: 'room/:id', component:RoomDetailsComponent},
  { path: 'chat', component: ChatComponent },
  { path: 'signin-google', component: CallbackComponent },
  { path: 'hometest', component: HometestComponent },
  { path: 'host/editlisting/:id', component: EditHostListingComponent },
  // { path: 'host/listings', component: HostListingsComponent },
   {
    path: 'host',
    component: HostLayoutComponent,
    children: [
      { path: 'listings', component: HostListingsComponent },
      // { path: 'dashboard', component: HostDashboardComponent },
      // { path: 'requests', component: HostRequestsComponent },
      // { path: 'chat', component: HostChatComponent },
      // { path: 'rules', component: HostRulesComponent }
    ]
  },
  { path: '**', component: NotfoundComponent },
];
