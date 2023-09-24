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
  ]
})
export class ModulesModule { }
