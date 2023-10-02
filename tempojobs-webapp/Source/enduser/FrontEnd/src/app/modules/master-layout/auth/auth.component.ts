import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NbAuthComponent, NbAuthService } from '@nebular/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent extends NbAuthComponent implements OnInit{
  constructor(
    protected service: NbAuthService,
    protected location: Location,
  ) {
    super(service, location);
    // this.settingService.getConfigCompany().subscribe(res => {
    //   if (res) this.configCompany = res;
    // });
  }

  ngOnInit(): void {
    
  }
}
