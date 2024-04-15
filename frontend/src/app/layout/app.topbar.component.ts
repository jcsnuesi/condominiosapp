import { Component, ElementRef, ViewChild, DoCheck, OnInit, Input } from '@angular/core';
import { LayoutService } from "./service/app.layout.service";
import { UserService } from '../demo/service/user.service';
import { User } from '../demo/models/user.model';
import { MenuItem, MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { CondominioService } from '../demo/service/condominios.service';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [MessageService, CondominioService]
})
export class AppTopBarComponent implements DoCheck, OnInit {

    items: MenuItem[] | undefined;

  

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    public identity: User;
    public condominio_info:any;
    public propertyInfo: any;
    public urlValidator:boolean;
    @Input() item = ''

    constructor(
        public layoutService: LayoutService,
        private _userService:UserService,
        private _messageService: MessageService,
        private _cookieService: CookieService,
        private _router: Router,
        private _condominioService:CondominioService,
        private _activatedRoute: ActivatedRoute
        ) {}
       
        urlChecker(){
         
          
            return (window.location.href).includes('home') 
            
                       
        }
        
   
        
        ngOnInit(): void {
            

            this.identity = this._userService.getIdentity()
            console.log(this._userService.getToken())
          
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

        // Terminar la comunicacion entre dashboard component y este component
        ngDoCheck(): void {

            this.identity = this._userService.getIdentity()
                        
            // if (this.urlChecker()) {

            //     this.propertyInfo = CondominioService.propertyDetails[0]
            //     console.log(this.propertyInfo)
              
            // }
            
          
            
            
 
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
