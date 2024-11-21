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
import { StaffService } from '../../service/staff.service';



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
  providers: [UserService, ConfirmationService, MessageService, StaffService]  
})
export class CreateUserComponent implements OnInit {

  public userModel: Staff;
  public users: any;
  public userInfo: any;
  public token: string;
  public selectedStaffs: any;
  public userDialog: boolean;
  public genderModel:{name: string, code: string}[];
  public passwordActive: boolean = false;
  public positionOptions: { name: string, code: string}[];
  public roleOptions: { name: string, code: string}[];
  public permissionsOptions: { name: string, code: string}[];
  public permissions: any;
  public genderSelected: any;
  public roleSelected: any;
  public positionSelected: any;
  public current_permissions: any;
  public dialogHeader: string;


  constructor(
    private _userService: UserService, 
    private _confirmationService: ConfirmationService, 
    private _messageService: MessageService,
  private _staffService: StaffService) {

    this.selectedStaffs = [];
    this.positionSelected = [];
    this.token = this._userService.getToken();
    this.userModel = new Staff('','','','','','','','','');    
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
      { name: 'Handyman', code: 'handyman' },
      { name: 'Customer care', code: 'customer_care' }
    ];
   
    this.permissionsOptions = [
      { name: 'Create', code: 'create'},
      { name: 'Read', code: 'read'},
      { name: 'Update', code: 'update'},
      { name: 'Delete', code: 'delete'}
    ];

   }

   ngOnInit(): void {

    // Cargamos todos los usuarios
     this.getAllStaff();
       
   }

   getAllStaff(){

    //  this._staffService.getStaff(this.token).subscribe({

    //    next: (response) => {

    //      this.users = response.message
      
    //    },

    //    error: (error) => {

    //      console.log("error", error)
    //    },
    //    complete: () => {

    //      console.log('Get staff complete!')
    //    }

    //  });

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
   
        const ids = this.selectedStaffs.map((staff) => staff._id);       

        this._staffService.deleteStaff(this.token, ids).subscribe({
          
            next: (response)  => {
              console.log(response)
              if (response.status == 'success') {

                this.getAllStaff();
                this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Staffs deleted successfully!', life: 3000 });
            
              }else{
                this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staffs not deleted', life: 3000 });
              }
          
            },
      
            error: (error) => {
      
              console.log("error", error)
              this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staffs not deleted', life: 3000 });
      
            },
            complete: () => {
      
              console.log('Staffs deleted!')
            }
        });
       
      }
    });
  }

  

  public btnLabel:string;
  openNew() {
    this.userDialog = true; 
    this.btnLabel = 'Create';
    this.dialogHeader = 'Create User';
    this.passwordActive = false;

    Object.keys(this.userModel).forEach((key) => {
      this.userModel[key] = '';
    })

    // Restablecer todos los campos del modelo userModel
    this.userModel = new Staff('', '', '', '', '', '', '', '', '');

    // Restablecer las variables relacionadas con el formulario
    this.permissions = [];
    this.genderSelected = 'Select gender...';
    this.roleSelected = 'Select role...';
    this.positionSelected = 'Select position...';
    
    
    
  }

  hideDialog() {
    this.userDialog = false;
    
  }

  txtGender: string;
  editStaff(user: any) {

    this.userDialog = true;
    this.btnLabel = 'Update';
    this.dialogHeader = 'Edit User';
    this.passwordActive = true;


    for (const key in this.userModel) {
    
      this.userModel[key] = user[key];
      
    }

    this.genderSelected = this.userModel['gender'] == 'M' ? { name: 'Male', code: 'M' } : { name: 'Female', code: 'F' };

    this.positionSelected = this.positionOptions.filter((position) => position.code.toUpperCase() == user.position.toUpperCase())[0].name;

    // Cargamos los permisos del usuario  al dropdown
    var perm = [];
    user.permissions.forEach((permission) =>{
   
     for (let i = 0; i < this.permissionsOptions.length; i++) {
   
       console.log(this.permissionsOptions[i].code.trim() == permission.trim()) 
       if (this.permissionsOptions[i].code.trim() == permission.trim()) {
         perm.push(this.permissionsOptions[i]);  
        
      }  
      
    }
    
    } );
   
    this.permissions = perm
    this.current_permissions = user.permissions;
  
 

  }

  getAvatarFirstLetter(name: string) {
    return (name?.charAt(0)).toUpperCase();
  }

  getDate(date: any) {
    return new Date(date).toDateString();
  }

  deleteUser(user: any) {

    this._confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        const ids = new Array(user._id);

        this._staffService.deleteStaff(this.token, ids).subscribe({

          next: (response) => {
           
            if (response.status == 'success') {

              this.getAllStaff();
              this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Staffs deleted successfully!', life: 3000 });

            } else {
              this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staffs not deleted', life: 3000 });
            }

          },

          error: (error) => {

            console.log("error", error)
            this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staffs not deleted', life: 3000 });

          },
          complete: () => {

            console.log('Staffs deleted!')
          }
        });

      }
    });
  }


  saveUser(event:any) {

    switch (event.label) {
      case 'Create':
        
        this._confirmationService.confirm({
          message: 'Are you sure you want to create this user?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {

            this.userModel.permissions = '';
            this.permissions.forEach((permission) => {
              this.userModel.permissions += permission.code + ',';
            });

            this.userModel.position = this.positionSelected.code;
            this.userModel.gender = this.genderSelected.code;
            this.submit();

          }
        });

        break;
      case 'Update':

        this._confirmationService.confirm({
          message: 'Are you sure you want to update this user?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {

            this.userModel.permissions = '';
            this.permissions.forEach((permission) => {
              this.userModel.permissions += permission.code + ',';
            });

            this.userModel.position = this.positionSelected.code;
            this.userModel.gender = this.genderSelected.code;
            this.update();

          }
        });

        
        break;
    
    }
 
    
 
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

  update(){

    this._staffService.updateStaff(this.token, this.userModel).subscribe({
        
        next: (response)  => {
          
          if (response.status == 'success') {
            this.getAllStaff();
            this.userDialog = false;
            this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Staff updated successfully!', life: 3000 });
         
          }else{
            this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staff not updated', life: 3000 });
          }
       
        },
  
        error: (error) => {
  
          console.log("error", error)
          this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staff not updated', life: 3000 });

        },
        complete: () => {
  
          console.log('Staff updated!')
        }
    });
  }

  submit(){

   
    // this._staffService.create(this.userModel, this.token).subscribe({
        
    //     next: (response)  => {
          
    //       if (response.status == 'success') {
    //         this.getAllStaff();
    //         this.userDialog = false;
    //         this._messageService.add({ severity: 'success', summary: 'Successful', detail: 'Staff created successfully', life: 3000 });
            
    //       } else {

    //         this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staff not created', life: 3000 });

    //       }
       
        
    //     },
  
    //     error: (error) => {
  
    //       console.log("error", error)
    //       this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staff not created', life: 3000 });

    //     },
    //     complete: () => {
  
    //       console.log('Staff created!')
    //     }
    // });
    
  }

}
