import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UserService } from 'src/app/demo/service/user.service';
import { CookieService } from "ngx-cookie-service";
import { Router } from '@angular/router';
import { global } from 'src/app/demo/service/global.service';



@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [UserService, CookieService]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    public url;

     
    password!: string;
    public administrator: { email: string, password: string } = { email: '', password: '' };;

    constructor(public layoutService: LayoutService,
        private _userService: UserService,
        private _cookieService: CookieService,
        private _route: Router) {

        this.url = global.url;
        }


    loginAdministrators(){
      
        this._userService.login(this.administrator, false).subscribe(
            login => {
                
                if (login.status == 'success') {
                    
                    this._userService.login(this.administrator, true).subscribe(
                        token => {
                            
                            if (token.token) {
                                
                                this._cookieService.set('identity', JSON.stringify(login.message) )
                              
                                this._route.navigate(['/'])
                                
                            }
                        }
                    )
                }

           

            },

            error => {

                console.log(error)
            }
        )

    }

}
