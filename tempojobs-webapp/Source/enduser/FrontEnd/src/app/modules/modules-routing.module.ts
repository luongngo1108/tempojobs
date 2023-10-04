import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthAuthGuardService } from "./auth-auth-guard.service";

const routes: Routes = [
    { path: 'auth', redirectTo: 'auth/login', pathMatch: 'full'},
    {
        path: '',
        // canActivate: [AuthGuardService],
        loadChildren: () => import('./home/home.module')
            .then(m => m.HomeModule)
    },
    {
        path: 'auth',
        canActivate: [AuthAuthGuardService],
        loadChildren: () => import('./master-layout/master-layout.module')
            .then(m => m.MasterLayoutModule)
    },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ModulesRoutingModule {
}
