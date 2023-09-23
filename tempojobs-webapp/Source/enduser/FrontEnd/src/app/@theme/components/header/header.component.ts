import { Component } from '@angular/core';
import { faCoffee, faEarthAsia, faCircleUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  faCoffee = faCoffee;
  faEarthAsia = faEarthAsia;
  faCircleUser = faCircleUser;
}
