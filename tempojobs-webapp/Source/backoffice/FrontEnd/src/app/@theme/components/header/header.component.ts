import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { lastValueFrom, Subject, Subscription } from 'rxjs';
import { NbAuthJWTToken, NbAuthService, NbTokenService } from '@nebular/auth';
import { Router } from '@angular/router';
import { ProfileDetail } from 'src/app/modules/shared/models/user.model';
import { UserManagementService } from 'src/app/modules/admin/user-management/user-management.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileDialogComponent } from 'src/app/modules/admin/profile-dialog/profile-dialog.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  userLoggedIn: any;
  userDetail: ProfileDetail;
  menuServiceObservable: Subscription = null;
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

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserManagementService,
    private layoutService: LayoutService,
    private tokenService: NbTokenService,
    private router: Router,
    private breakpointService: NbMediaBreakpointsService,
    private authService: NbAuthService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private cdref: ChangeDetectorRef
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
          cdref.detectChanges();
        }
      });

    this.userService._currentUserDetail.pipe(takeUntil(this.destroy$)).subscribe(detail => {
      if (detail) this.userDetail = detail;
    })
  }

  async ngOnInit() {
    var res = await lastValueFrom(this.userService.getUserDetailByUserId(this.userLoggedIn.user.id));
    if (res.result) {
      this.userDetail = res.result;
    }
    this.currentTheme = this.themeService.currentTheme;
    // catch menu event
    this.menuServiceObservable = this.menuService.onItemClick().subscribe((event) => {
      if (event.item['id'] === 'logout') {
        this.tokenService.clear();
        localStorage.clear();
        this.router.navigateByUrl("/auth");
      }
    })

    this.menuServiceObservable = this.menuService.onItemClick().subscribe((event) => {
      if (event.item['id'] === 'profile') {
        const dialogRef = this.dialog.open(ProfileDialogComponent, {
          width: '600px',
          height: '100vh',
          backdropClass: 'custom-backdrop',
          hasBackdrop: true,
          data: {
            isOwnProfile: true,
            action: 'Edit',
            model: this.userDetail
          },
        });

        dialogRef.afterClosed().subscribe(async res => {
          if (res) {
            this.messageService.clear();
            this.messageService.add({
              key: 'toast1', severity: 'success', summary: 'Thành công',
              detail: `Thay đổi thông tin cá nhân thành công!`, life: 2000
            });
            var response = await lastValueFrom(this.userService.getUserDetailByUserId(this.userLoggedIn.user.id));
            if(response.result)this.userDetail = response.result;
          }
        })
      }
    })

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
