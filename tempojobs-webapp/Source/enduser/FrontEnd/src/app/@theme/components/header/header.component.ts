import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCoffee, faEarthAsia, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';


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

  isLogin = false;
  @Input() isIntro: boolean = true;

  userMenu = [{ title: 'Profile', id: 'profile' }, { title: 'Log out', id: 'logout' }];
  constructor (
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private tokenService: NbTokenService,
    private router: Router,
    private breakpointService: NbMediaBreakpointsService,
    private authService: NbAuthService
  ) {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.userLoggedIn = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
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
