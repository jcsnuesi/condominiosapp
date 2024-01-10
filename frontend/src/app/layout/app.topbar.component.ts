import { Component, ElementRef, ViewChild, DoCheck, OnInit} from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { UserService } from '../demo/service/user.service';
import { User } from '../demo/models/user.model';
import { MenuItem, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [MessageService]
})
export class AppTopBarComponent implements DoCheck, OnInit {

    items: MenuItem[] | undefined;

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    public identity: User;

    constructor(
        public layoutService: LayoutService,
        private _userService:UserService,
        private _messageService: MessageService,
        private _cookieService: CookieService,
        private _router: Router
        ) {}


        ngOnInit(): void {

            this.identity = this._userService.getIdentity()

            this.items = [
                {
                    label: 'Profile',
                    items: [
                        {
                            label: 'setting',
                            icon: 'pi pi-cog',
                            command: () => {
                                this.update();
                            }
                        },
                        {
                            label: 'Delete',
                            icon: 'pi pi-times',
                            command: () => {
                                this.delete();
                            }
                        }
                    ]
                },
                {
                    label: 'Loggout',
                    items: [
                        {
                            label: 'Exit',
                            icon: 'pi pi-power-off',
                            command: () => {
                            this.destroySession();
                        }
                        },
                        {
                            label: 'Router',
                            icon: 'pi pi-upload',
                            routerLink: '/fileupload'
                        }
                    ]
                }
            ];
            
        }

        ngDoCheck(): void {

            this.identity = this._userService.getIdentity()
            
        }

    update() {
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Data Updated' });
    }

    delete() {
        this._messageService.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted' });
    }

    destroySession(){

        this._cookieService.deleteAll()
        this._router.navigate(['auth/login'])
    }

   

}
