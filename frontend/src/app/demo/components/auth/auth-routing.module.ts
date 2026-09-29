import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'error',
                loadChildren: () =>
                    import('./error/error.module').then((m) => m.ErrorModule),
            },
            {
                path: 'access',
                loadChildren: () =>
                    import('./access/access.module').then(
                        (m) => m.AccessModule
                    ),
            },
            {
                path: 'login',
                loadChildren: () =>
                    import('./login/login.module').then((m) => m.LoginModule),
            },
            {
                path: 'forgot-password',
                loadChildren: () =>
                    import('./forgot-password/forgot-password.module').then(
                        (m) => m.ForgotPasswordModule
                    ),
            },
            {
                path: 'reset-password',
                loadChildren: () =>
                    import('./reset-password/reset-password.module').then(
                        (m) => m.ResetPasswordModule
                    ),
            },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
