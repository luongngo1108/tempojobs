import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCoffee, faEarthAsia, faCircleUser, faBell, faMessage } from '@fortawesome/free-solid-svg-icons';
import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject, Subscription } from 'rxjs';
import { map, takeLast, takeUntil } from 'rxjs/operators';
import { UserManagementService } from 'src/app/modules/home/profile/user-management.service';
import { User } from 'src/app/modules/home/profile/user.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  userLoggedIn: any;
  menuServiceObservable: Subscription = null;
  faCoffee = faCoffee;
  faEarthAsia = faEarthAsia;
  faCircleUser = faCircleUser;
  faBell = faBell;
  faMessage = faMessage;
  isLogin: boolean = false;

  isIntro: boolean = true;

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
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.userLoggedIn = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
          userService._currentUser.next(this.userLoggedIn);
          // userService.getCurrentUser().subscribe(x => {
          //   console.log(JSON.parse(JSON.stringify(x)))
          // })
          console.log(this.userLoggedIn);
          this.isLogin = true;
        }
      });
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
        // this.userService._currentUser.next(this.userLoggedIn);
      }
    })

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

      if (this.router.url !== "/") {
        this.isIntro = false;
      }
  }

  ngOnDestroy() {
    if (this.menuServiceObservable != null) {
      this.menuServiceObservable.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
