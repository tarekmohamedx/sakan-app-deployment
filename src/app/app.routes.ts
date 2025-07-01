import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HometestComponent } from './hometest/hometest.component';
import { HomePageComponent } from './features/home/pages/home-page/home-page.component';
import { ListingsPageComponent } from './features/listings/pages/listings-page/listings-page.component';
import { WishlistPageComponent } from './features/wishlist/pages/wishlist-page/wishlist-page.component';
import { PaymentFormComponent } from './features/checkout/pages/payment-form/payment-form.component';

export const routes: Routes = [
  { path: 'home', component: HomePageComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'listings', component: ListingsPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'hometest', component: HometestComponent },
  { path: 'wishlist', component: WishlistPageComponent},
  { path: 'payment', component: PaymentFormComponent},
];
