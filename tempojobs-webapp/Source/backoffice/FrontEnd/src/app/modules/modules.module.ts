import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModulesRoutingModule } from './modules-routing.module';
import { NbPasswordAuthStrategy, NbAuthModule, NbAuthJWTToken } from '@nebular/auth';
import { environment } from 'src/enviroments/enviroment';

@NgModule({
  declarations: [],
  imports: [
    ModulesRoutingModule,
    CommonModule,

    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          baseEndpoint: environment.apiAuth,
          login: {
            endpoint: '/login/Admin',
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
  ]
})
export class ModulesModule { }
