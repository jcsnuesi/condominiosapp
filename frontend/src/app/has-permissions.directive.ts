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
 ;
   }

  @Input() 
  set appHasPermissions(permissionsUser: string[]) {
    this.permissions = permissionsUser;    
    this.UpdateView() 
    
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
    // console.log("permissionsFound", currentUser);
    // console.log("this.identity", this.identity);


    if(this.identity && this.identity.role) {
      // TODO: USER ROLE   

      const permissionsFound = currentUser.find(perm => perm.toLowerCase() === this.permissions);
      if (permissionsFound) {
        has_perms = true;
      }
    }
    return has_perms;
  }

  

}
