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
            endpoint: '/login/User',
            requireValidToken: true,
            redirect: {
              success: '/',
              failure: '/auth/login',
            },
          },
          register: {
            endpoint: '/register',
            redirect: {
              success: '/',
              failure: '/auth/register',
            },
          },
          requestPass: {
            endpoint: '/reset',
            redirect: {
              success: '/auth/reset-password',
              failure: '/auth/request-password'
            }
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
