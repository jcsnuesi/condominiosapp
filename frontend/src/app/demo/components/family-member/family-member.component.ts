import { Component } from '@angular/core';
import {  ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';

type FamilyAccess = {

  avatar: string,
  name: string,
  lastname: string,
  gender: string,
  phone: string,
  email: string,
  password: string,
  status: string,
  role: string

}

@Component({
  selector: 'app-family-member',
  standalone: true,
  imports: [
    HasPermissionsDirective,
    ConfirmDialogModule,
    DropdownModule,
    FormsModule,
    CommonModule,
    FileUploadModule,
    InputGroupModule,
    InputGroupAddonModule,
    ToastModule,
    InputTextModule,
    AvatarModule,
    AvatarGroupModule,
    ToolbarModule,
    DialogModule
  ],
  templateUrl: './family-member.component.html',
  styleUrl: './family-member.component.scss',
  providers: [MessageService,
    ConfirmationService]
})
export class FamilyMemberComponent {

  public userDialog: boolean;
  public authorizedUser!: FamilyAccess[];


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {

    this.authorizedUser = [
      {
        avatar: '',
        name: '',
        lastname: '',
        gender: "",
        phone: '',
        email: '',
        password: '',
        status: '',
        role: ''
      }
    ]
  }


  openNew() {
    this.userDialog = true;

  }



  hideDialog() {
    this.userDialog = false;

  }

 
  
  saveUser(event: any) {

    switch (event.label) {
      case 'Create':

        this.confirmationService.confirm({
          message: 'Are you sure you want to create this user?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {



            this.submitFamilyUser();

          }
        });

        break;
      case 'Update':

        this.confirmationService.confirm({
          message: 'Are you sure you want to update this user?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {



            this.updateFamilyUser();

          }
        });


        break;

    }



  }

  updateFamilyUser(){
    this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Updated', life: 3000});
    this.userDialog = false;
  }

  submitFamilyUser(){
    this.messageService.add({severity:'success', summary: 'Successful', detail: 'User Created', life: 3000});
    this.userDialog = false;
  }


}
