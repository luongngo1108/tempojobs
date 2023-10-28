import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faEarthAsia, faCircleUser, faBell, faMessage } from '@fortawesome/free-solid-svg-icons';
import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject, Subscription, lastValueFrom } from 'rxjs';
import { map, takeLast, takeUntil } from 'rxjs/operators';
import { UserManagementService } from 'src/app/modules/home/profile/user-management.service';
import { ProfileDetail, User } from 'src/app/modules/home/profile/user.model';


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

  userMenu = [{ title: 'Profile', id: 'profile' }, { title: 'Log out', id: 'logout' }];
  constructor (
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private tokenService: NbTokenService,
    private router: Router,
    private breakpointService: NbMediaBreakpointsService,
    private authService: NbAuthService,
    private userService: UserManagementService,
  ) {
    this.authService.onTokenChange().pipe(takeUntil(this.destroy$))
      .subscribe(async (token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.userLoggedIn = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
          var res = await lastValueFrom(this.userService.getUserDetailByUserId(this.userLoggedIn.user.id));
          if(res.result) {
            this.userDetail = res.result;
            userService._currentUserDetail.next(this.userDetail);
          }
          this.isLogin = true;
        }
      });

    this.userService._currentUserDetail.pipe(takeUntil(this.destroy$)).subscribe(detail => {
      if(detail) this.userDetail = detail;
    })
  }

  ngOnInit() {
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
}
