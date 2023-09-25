import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AdminAuthGuardService} from "./admin-auth-guard.service";
import { AuthAuthGuardService } from "./auth-auth-guard.service";

const routes: Routes = [
    {
        path: 'admin',
        canActivate: [AdminAuthGuardService],
        loadChildren: () => import('./admin/admin.module')
            .then(m => m.AdminModule)
    },
    {
        path: 'auth',
        canActivate: [AuthAuthGuardService],
        loadChildren: () => import('./home/home.module')
            .then(m => m.HomeModule)
    },
    { path: '', redirectTo: 'admin', pathMatch: 'full'},
    { path: '**', redirectTo: 'admin', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ModulesRoutingModule {
}
