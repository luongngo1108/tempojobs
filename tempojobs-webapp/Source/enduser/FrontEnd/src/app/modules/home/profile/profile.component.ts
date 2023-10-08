import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isEditProfile: boolean = false;
  ngOnInit(): void {
    
  }

  changeTab(tabName: string) {
    switch(tabName) {
      case 'about-me':
        this.isEditProfile = false;
        break;
      case 'edit-profile':
        this.isEditProfile = true;
        break;
    }
  }
}
