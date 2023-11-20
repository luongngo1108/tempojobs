import { Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { faEarthAsia, faCircleUser, faBell, faMessage } from '@fortawesome/free-solid-svg-icons';
import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject, Subscription, lastValueFrom } from 'rxjs';
import { map, takeLast, takeUntil } from 'rxjs/operators';
import { UserManagementService } from 'src/app/modules/home/profile/user-management.service';
import { ProfileDetail, User } from 'src/app/modules/home/profile/user.model';
import { Notification } from './notification.model';
import { NotificationService } from './notification.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  userLoggedIn: any;
  userDetail: ProfileDetail;
  menuServiceObservable: Subscription = null;
  faEarthAsia = faEarthAsia;
  faCircleUser = faCircleUser;
  isLogin: boolean = false;
  skeletonLoading: boolean = false;
  loading: boolean = false;
  countNotification: number = 0;
  listNotification: Notification[] = [];
  pageNumber: number = 0;
  throttle = 0;
  scrollDistance = 1;
  infiniteScrollUpDistance = 1.5
  userMenu = [{ title: 'Profile', id: 'profile' }, { title: 'Log out', id: 'logout' }];
  constructor(
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private tokenService: NbTokenService,
    private router: Router,
    private breakpointService: NbMediaBreakpointsService,
    private authService: NbAuthService,
    private userService: UserManagementService,
    private cdref: ChangeDetectorRef,
    private notificationService: NotificationService
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
      .subscribe(async (token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.userLoggedIn = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
          var res = await lastValueFrom(this.userService.getUserDetailByUserId(this.userLoggedIn.user.id));
          if (res.result) {
            this.userDetail = res.result;
            userService._currentUserDetail.next(this.userDetail);
          }
          this.isLogin = true;
          cdref.detectChanges();
        }
      });

    this.userService._currentUserDetail.pipe(takeUntil(this.destroy$)).subscribe(detail => {
      if (detail) this.userDetail = detail;
    })
  }

  ngOnInit() {
    this.notificationService.getNotificationByUserId(this.userLoggedIn.user.id, -1).subscribe(res => {
      if (res.result && res.result.length > 0) {
        this.countNotification = res.result.filter(x => !x.isRead).length;
      }
    })
    // this.currentTheme = this.themeService.currentTheme;
    // catch menu event
    this.menuServiceObservable = this.menuService.onItemClick().subscribe((event) => {
      if (event.item['id'] === 'logout') {
        this.tokenService.clear();
        localStorage.clear();
        this.isLogin = false;
        this.router.navigateByUrl("/auth");
      }
    })

    this.menuServiceObservable = this.menuService.onItemClick().subscribe((event) => {
      if (event.item['id'] === 'profile') {
        this.router.navigateByUrl("/profile");
      }
    })

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);
  }

  ngOnDestroy() {
    if (this.menuServiceObservable != null) {
      this.menuServiceObservable.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  getListNotifications() {
    this.skeletonLoading = true;
    this.listNotification = [];
    this.pageNumber = 0;
    this.notificationService.getNotificationByUserId(this.userLoggedIn.user.id, this.pageNumber).subscribe(res => {
      if (res.result) {
        this.listNotification = res.result;
        this.pageNumber++;
        this.skeletonLoading = false;
      }
    })
  }

  menuClosed() {

  }

  onScroll() {
    this.loading = true;
    this.notificationService.getNotificationByUserId(this.userLoggedIn.user.id, this.pageNumber).subscribe(res => {
      if (res.result && res.result.length > 0) {
        res.result.forEach(element => {
          this.listNotification.push(element);
        });
        this.pageNumber++;   
      }
      this.loading = false;
    })
  }

  navigateUrl(noti: Notification) {
    if(noti.redirectUrl) this.router.navigateByUrl(noti.redirectUrl);
    noti.isRead = true;
    this.notificationService.saveNotifcation(this.userLoggedIn.user.id,noti).subscribe(res => {
      if(res.result) {
        this.countNotification = res.result.filter(x => !x.isRead).length;
      }
    })
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead(this.userLoggedIn.user.id).subscribe(res => {
      if(res.result) {
        this.countNotification = res.result.filter(x => !x.isRead).length;
      }
    })
  }
}
