import { Directive, Input } from '@angular/core';
import { UserService } from './demo/service/user.service';
import { StaffService } from './demo/service/staff.service';
import { TemplateRef, ViewContainerRef } from '@angular/core';


@Directive({
  selector: '[appHasPermissions]',
  standalone: true,
  providers: [
    UserService,
    StaffService
  ]
})
export class HasPermissionsDirective {

  public identity: any;
  public permissions: string[];


  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService,
    private staffService: StaffService
  ) {

    this.identity = this.userService.getIdentity();

   }

  @Input() 
  set appHasPermissions(permissionsUser: string[]) {
    this.permissions = permissionsUser;
    this.UpdateView() 
    console.log('permissions', permissionsUser);
  }

  private UpdateView() {

    this.viewContainer.clear();
    if (this.checkPermissions()){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }

  }

  private checkPermissions(): boolean {
    
    let has_perms = false; 
    let currentUser = new Array(this.identity.role);


    if(this.identity && this.identity.role) {
      // TODO: USER ROLE
      for (const checkPerm of this.permissions) {
        // TODO: DATA ACCESS

        const permissionsFound = currentUser.find(perm => perm === checkPerm);

        if (permissionsFound) {
          has_perms = true;
          break;
          
        }


      }
    }
    return has_perms;
  }

  private checkRole(roles: string[]) {

    this.identity = this.userService.getIdentity();
    console.log('identity', this.identity);
    if (this.identity) {
      if (roles.includes(this.identity.role)) {
       
      } else {
        this.viewContainer.clear();
      }
    } else {
      this.viewContainer.clear();
    }



  }

}
