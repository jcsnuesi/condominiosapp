import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Staff } from '../../models/staff.model';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';

interface Permissions {
  name: string,
  code: string
}

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    TableModule,
    ToastModule,
    ToolbarModule,
    FileUploadModule,
    AvatarGroupModule,
    AvatarModule,
    FormsModule,
    CommonModule,
    ConfirmDialogModule,
    DialogModule,
    TagModule,
    DropdownModule,
    MultiSelectModule,
    InputTextModule 
    
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
  providers: [UserService, ConfirmationService, MessageService]  
})
export class CreateUserComponent implements OnInit {

  public userModel: Staff;
  public users: any;
  public userInfo: any;
  public token: string;
  public selectedProducts: any;
  public userDialog: boolean;
  public genderModel:{name: string, code: string}[];
  public passwordActive: boolean = false;
  public positionOptions: { name: string, code: string}[];
  public roleOptions: { name: string, code: string}[];
  public permissionsOptions: { name: string, code: string}[];
  public permissions!: Permissions[];
  public genderSelected: any;
  public roleSelected: any;
  public positionSelected: any;


  constructor(private _userService: UserService, private _confirmationService: ConfirmationService, private _messageService: MessageService) {

    this.selectedProducts = [];
    this.token = this._userService.getToken();
    this.userModel = new Staff('','','','','','','','','','');    
    this.genderModel = [
      {name:'Female', code:'F'}, 
      {name:'Male', code:'M'}
    ];
    this.passwordActive = false;
    this.positionOptions = [
      { name: 'Manager', code: 'manager'}, 
      { name: 'Accounting', code: 'accounting'},
      { name: 'Sales', code: 'sales'},
      { name: 'Marketing', code: 'marketing'},
      { name: 'Human Resources', code: 'human_resources'},
      { name: 'Handyman', code: 'handy_man' },
    ];

    this.roleOptions = [
      { name: 'Admin', code: 'admin'},
      { name: 'Staff', code: 'staff'}
    ]

    this.permissionsOptions = [
      { name: 'Create', code: 'create'},
      { name: 'Read', code: 'read'},
      { name: 'Update', code: 'update'},
      { name: 'Delete', code: 'delete'}
    ]



   }


   ngOnInit(): void {

     this.userModel.gender = "Select gender...";
     this._userService.getStaff(this.token).subscribe({
      
      next: (response)  => {

         this.users = response.message
        console.log(this.users)
      },

      error: (error) => {

        console.log("error", error)
      },
      complete: () => {

        console.log('Get staff complete!')
      }
    
    });

       
   }

   upperCase(user){

    return user.toUpperCase();
   }

  deleteSelectedUsers() {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.products = this.products.filter((val) => !this.selectedProducts?.includes(val));
        this.selectedProducts = null;
        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      }
    });
  }

  openNew() {
    this.userDialog = true; 

    Object.keys(this.userModel).forEach((key) => {
      this.userModel[key] = '';
    })

    this.positionSelected = '';
    this.genderSelected = 'Select gender...';
    this.roleSelected = '';
    
    
    
  }

  hideDialog() {
    this.userDialog = false;
    
  }

  txtGender: string;
  editProduct(user: any) {
    this.userDialog = true;
    this.passwordActive = true;

    this.userModel.name = user.name;
    this.userModel.gender = user.gender
    this.userModel.lastname = user.lastname;
    this.genderSelected = (this.genderModel[0].name = user.gender)
    this.userModel.phone = user.phone;
    this.userModel.government_id = user.government_id;
    this.userModel.position = user.position;
    this.userModel.email = user.email;
    this.userModel.role = user.role;
    this.userModel.permissions = user.permissions;
    console.log(this.genderSelected)

  }

  getAvatarFirstLetter(name: string) {
    return (name?.charAt(0)).toUpperCase();
  }

  getDate(date: any) {
    return new Date(date).toDateString();
  }

  deleteUser(user: any) {
    this._confirmationService.confirm({
      message: 'Are you sure you want to delete ' + user.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // this.products = this.products.filter((val) => val.id !== product.id);
        // this.product = {};
        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      }
    });
  }


  saveUser() {
    // this.submitted = true;

    this._confirmationService.confirm({
      message: 'Are you sure you want to create this user?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      
        this.permissions.forEach((permission) => {
          this.userModel.permissions += permission.code + ',';
        });

        this.userModel.position = this.positionSelected.code;
        this.userModel.gender = this.genderSelected.code;
        this.userModel.role = this.roleSelected.code;

       this.submit(this.userModel);
        this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
      }
    });    
    
  }

 
  getSeverity(status: string) {
  
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'danger';     
      default:
        return 'nan';
    }
  }


  submit(form:any){

    console.log(this.userModel)
  }

}
