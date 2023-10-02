import { Component, Input } from '@angular/core';
import { faCoffee, faEarthAsia, faCircleUser, faBell, faMessage } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  faCoffee = faCoffee;
  faEarthAsia = faEarthAsia;
  faCircleUser = faCircleUser;
  faBell = faBell;
  faMessage = faMessage;

  @Input() isIntro: boolean = true;
  @Input() isLogin: boolean = false;
  constructor() {

  }
}
