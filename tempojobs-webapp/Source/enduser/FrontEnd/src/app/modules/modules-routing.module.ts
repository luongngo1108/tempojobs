import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    {
        path: '',
        // canActivate: [AuthGuardService],
        loadChildren: () => import('./home/home.module')
            .then(m => m.HomeModule)
    },
    { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ModulesRoutingModule {
}
