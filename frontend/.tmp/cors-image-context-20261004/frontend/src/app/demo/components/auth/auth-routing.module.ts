import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'register',
                loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent),
            },
            {
                path: 'verify/:type/:token',
                loadComponent: () => import('./signup/verify-account.component').then(m => m.VerifyAccountComponent),
            },
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
                path: 'iot-register',
                loadChildren: () =>
                    import(
                        './iot-owner-register/iot-owner-register.module'
                    ).then((m) => m.IoTOwnerRegisterModule),
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
