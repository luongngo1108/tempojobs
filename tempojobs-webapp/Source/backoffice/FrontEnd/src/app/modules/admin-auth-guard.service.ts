import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme'
import { tap, takeLast } from 'rxjs';

export const AdminAuthGuardService: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(NbAuthService);
    const router = inject(Router);
    const toast = inject(NbToastrService)
    return authService.isAuthenticated()
        .pipe(
            tap(authenticated => {
                if (!authenticated) {
                    router.navigate([`/auth`], {
                        // queryParams: { returnUrl: state.url }
                    }).then(() => {
                        toast.warning("You need to login!", "Warning");
                    });
                }
                return;
            })
        );
}