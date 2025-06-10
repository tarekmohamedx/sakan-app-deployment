import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../core/services/auth.service';
import { isUndefined } from 'util';
import { Console } from 'console';

@Component({
  selector: 'app-hometest',
  standalone: true,
  imports: [],
  templateUrl: './hometest.component.html',
  styleUrl: './hometest.component.css',
})
export class HometestComponent implements OnInit {
  username!: string  | undefined;
  decodedToken: any;

  
  constructor(private authservice:AuthService) {
    
  }
  ngOnInit(): void {
    // this.username = this.authservice.getuserdata()?.username;
    // console.log('name = ' + this.authservice.getuserdata()?.username);
    // console.log('USERNAME is = ' + this.username);

    this.username = this.authservice.getuserdata()?.name;
    console.log('name = ' + this.username);
   

  }
}
