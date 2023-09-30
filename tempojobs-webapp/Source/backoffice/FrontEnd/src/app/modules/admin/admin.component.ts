import { Component } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { MENU_ITEMS } from './menu-items';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  user = {};
  menu = MENU_ITEMS;
  constructor(private authService: NbAuthService) {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
    
      if (token.isValid()) {
        this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
      }
      
    });
  }
}
