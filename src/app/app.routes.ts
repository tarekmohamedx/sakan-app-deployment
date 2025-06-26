import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HometestComponent } from './hometest/hometest.component';
import { CallbackComponent } from './callback/callback.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'hometest', component: HometestComponent },
  { path: 'signin-google', component: CallbackComponent },
];
