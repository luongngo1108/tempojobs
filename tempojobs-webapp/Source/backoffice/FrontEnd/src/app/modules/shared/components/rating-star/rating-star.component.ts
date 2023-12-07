import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { UserManagementService } from 'src/app/modules/admin/user-management/user-management.service';
@Component({
  selector: 'app-rating-star',
  templateUrl: './rating-star.component.html',
  styleUrls: ['./rating-star.component.scss']
})
export class RatingStarComponent {
  @Input() profileId: string;

  constructor(
    private elementRef: ElementRef, 
    private renderer: Renderer2,
    private userService: UserManagementService,
  ) {

  }

  async ngOnInit() {
    var overlayElement = this.elementRef.nativeElement.querySelector('.overlay');
    var respProfile = await this.userService.getUserDetailByUserId(this.profileId).toPromise();
    if (respProfile?.result) {
      if (respProfile?.result?.evaluation && respProfile?.result?.evaluation?.length > 0) {
        var totalStar = 0;
        respProfile?.result?.evaluation?.map(eva => totalStar += eva);
        var percentage = Math.round(((totalStar/respProfile?.result?.evaluation?.length) / 5) * 100);
        this.renderer.setStyle(overlayElement, 'width', `${100 - percentage}%`);
      }
    }
  }
}