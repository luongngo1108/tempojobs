import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
    {
        path: '',
        // canActivate: [AuthGuardService],
        loadChildren: () => import('./home/home.module')
            .then(m => m.HomeModule)
    },
    { 
        path: 'jobcreator',
        loadChildren: () => import('./jobcreator/jobcreator.module')
        .then(m => m.JobcreatorModule)
     },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ModulesRoutingModule {
}
