import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { UserManagementService } from 'src/app/modules/admin/user-management/user-management.service';
import { ProfileDetail } from '../../models/user.model';
@Component({
  selector: 'app-rating-star',
  templateUrl: './rating-star.component.html',
  styleUrls: ['./rating-star.component.scss']
})
export class RatingStarComponent {
  @Input() profileId: string;
  
  profile: ProfileDetail;

  constructor(
    private elementRef: ElementRef, 
    private renderer: Renderer2,
    private userService: UserManagementService,
  ) {

  }

  async ngOnInit() {
    var overlayElement = this.elementRef.nativeElement.querySelector('.overlay');
    if (typeof this.profileId === 'string') {
      var respProfile = await this.userService.getUserDetailByUserId(this.profileId).toPromise();
      if (respProfile?.result) {
        this.profile = respProfile.result;
      }
    } else {
      this.profile = this.profileId;
    }
    if (this.profile?.evaluation && this.profile?.evaluation?.length > 0) {
      var totalStar = 0;
      this.profile?.evaluation?.map(eva => totalStar += eva);
      var percentage = Math.round(((totalStar/this.profile?.evaluation?.length) / 5) * 100);
      this.renderer.setStyle(overlayElement, 'width', `${100 - percentage}%`);
    }
  }
}