import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HometestComponent } from './hometest/hometest.component';
import { NotfoundComponent } from './shared/components/notfound/notfound.component';
import { ChatComponent } from './features/chat/chat.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'hometest', component: HometestComponent },
  { path: 'chat', component: ChatComponent },
  // { path: 'chat', component: HometestComponent },
  { path: '**', component: NotfoundComponent },
];
