import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router"
import { UserService } from "./user.service";


@Injectable()
export class UserGuard implements CanActivate {

    constructor(
        private _router: Router,
        private _userService: UserService,
      
    ){}
   

    canActivate(): any{
        
        const isAuthenticated = this._userService.getIdentity();

        if (isAuthenticated && isAuthenticated._id) {
            return true; 
        } else {
          
            this._router.navigate(['auth/login']);
     
            return false;
            

        }


    }
    
}

