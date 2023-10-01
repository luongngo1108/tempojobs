import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCoffee, faEarthAsia, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { Subject, Subscription } from 'rxjs';
import { UserData } from 'src/app/@core/data/users';
import { LayoutService } from 'src/app/@core/utils';
import { map, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  menuServiceObservable: Subscription = null;
  faCoffee = faCoffee;
  faEarthAsia = faEarthAsia;
  faCircleUser = faCircleUser;

  isLogin = false;
  @Input() isIntro: boolean = true;
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Profile', id: 'profile' }, { title: 'Log out', id: 'logout' }];
  constructor (
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private tokenService: NbTokenService,
    private router: Router,
    private breakpointService: NbMediaBreakpointsService,
    private authService: NbAuthService
  ) {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload(); // here we receive a payload from the token and assigns it to our `user` variable 
          console.log(this.user);
          this.isLogin = true;
        }

      });
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    // catch menu event
    this.menuServiceObservable = this.menuService.onItemClick().subscribe((event) => {
      if (event.item['id'] === 'logout') {
        this.tokenService.clear();
        localStorage.clear();
        this.router.navigateByUrl("/auth");
      }
    })

    // this.userService.getUsers()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    if (this.menuServiceObservable != null) {
      this.menuServiceObservable.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
}
