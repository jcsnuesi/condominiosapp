import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UserService } from 'src/app/demo/service/user.service';
import { CookieService } from "ngx-cookie-service";
import { Router } from '@angular/router';
import { global } from 'src/app/demo/service/global.service';
import { MessageService } from 'primeng/api';

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
    providers: [UserService, CookieService, MessageService]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    public url;

     
    password!: string;
    public administrator: { email: string, password: string } = { email: '', password: '' };;

    constructor(public layoutService: LayoutService,
        private _userService: UserService,
        private _cookieService: CookieService,
        private _route: Router,
        private _messageService: MessageService) {

        this.url = global.url;
        }


    loginAdministrators(){
      
        this._userService.login(this.administrator, false).subscribe(
            login => {
                
                if (login.status == 'success') {
                    
                    this._userService.login(this.administrator, true).subscribe(
                        token => {
                            
                            if (token.token) {
                                const now = new Date();
                                const expiryTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                                
                                this._cookieService.set('identity', JSON.stringify(login.message), { expires: expiryTime })
                              
                                this._cookieService.set('token', token.token, { expires: expiryTime } )
                              
                                this._route.navigate(['/'])
                                
                            }
                        }
                    )
                }else{

                    this.show();
                }

           

            },

            error => {

                this.show();
            }
        )

    }

    show(){

        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Info was not verify, try again!' });
    }

}
