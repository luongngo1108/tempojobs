import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesRoutingModule } from './modules-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NbAuthJWTToken, NbAuthModule, NbPasswordAuthStrategy } from '@nebular/auth';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ModulesRoutingModule,
    SharedModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          baseEndpoint: environment.apiAuth,
          login: {
            endpoint: '/login',
            requireValidToken: true,
            redirect: {
              success: '/',
              failure: '/auth',
            },
          },
          requestPass: {
            endpoint: '/reset',
          },
          token: {
            class: NbAuthJWTToken,
            key: 'accessToken',
          }
        }),
      ],
      forms: {},    
    })
  ],
  exports: [
    CommonModule,
    
  ]
})
export class ModulesModule { }
