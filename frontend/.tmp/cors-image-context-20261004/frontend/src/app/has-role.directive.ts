import { Directive, Input } from '@angular/core';
import { UserService } from './demo/service/user.service';
import { StaffService } from './demo/service/staff.service';
import { TemplateRef, ViewContainerRef } from '@angular/core';


@Directive({
  selector: '[appHasRole]',
  standalone: true,
  providers: [
    UserService,
    StaffService
  ]
})
export class HasRoleDirective {

  public identity: any;
  public role: string;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userService: UserService,
    private staffService: StaffService
  ) { 

    this.identity = this.userService.getIdentity();

  }

  @Input()
  set appHasRole(role: string) {
    this.role = role.toLocaleUpperCase();
    this.UpdateView();

  }

  private UpdateView() {
    this.viewContainer.clear();
    if (this.checkRole()){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  private checkRole(): boolean {

  

    if (this.identity) {
      if (this.role.includes(this.identity.role)) {
        return true
      } else {
        this.viewContainer.clear();
        return false
      }
    } else {
      this.viewContainer.clear();
      return false
    }



  }


}
