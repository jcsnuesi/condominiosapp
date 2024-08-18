import { Component, OnInit } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
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
import { FormsModule, NgForm } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { TableModule } from 'primeng/table';
import { UserService } from '../../service/user.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';


type FamilyAccess = {

  
  name: string,
  lastname: string,
  gender: string,
  phone: string,
  email: string,
  password: string,
  addressId: string,
  ownerId: string


}

interface FamilyMembers {
    name: string,
    alias: string,
    addressInfo: any[],
    createdAt: string,
    status: string
}

@Component({
  selector: 'app-family-member',
  standalone: true,
  imports: [
    HasPermissionsDirective,
    ButtonModule,
    TagModule,
    CardModule,
    MultiSelectModule,
    ConfirmDialogModule,
    TableModule,
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
  providers: [
    MessageService,
    ConfirmationService,
    UserService]
})
export class FamilyMemberComponent implements OnInit  {

  public userDialog: boolean;
  public newFamilyMember!: FamilyAccess;
  private token: string;
  public authorizedUser: any;
  public propertyData: any;
  public selectedPermission!:Permissions[];
  public permission!:Permissions[];
  private identity:any;
  public genderOptions: { name: string; code: string; }[];
  public propertySelected: any;
  public genderSelected: any;
  public familyMembers: FamilyMembers;
  public nodata: boolean;
  public visibleUpdate: boolean;
  


  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _userService: UserService
  ) {

    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken();
    this.propertyData = [];

    this.newFamilyMember = {
      
      name: '',
      lastname: '',
      gender: "",
      phone: '',
      email: '',
      password: '',
      addressId: '',
      ownerId: this.identity._id

    }
  
    

    // Asignamos las propiedades al dropdown
    for (let index = 0; index < this.identity.propertyDetails.length; index++) {
      this.propertyData.push({ alias: this.identity.propertyDetails[index].addressId.alias, id: this.identity.propertyDetails[index].addressId._id})
      
    }

    this.genderOptions = [
      {name:"Male", code:"M"},
      { name: "Female", code: "F" }
    ]

  }


  ngOnInit(): void {

    
    this.getFamilies();
  }
 

  

  statusOptions(status: string) {
   
    const statusAuth = {active:'Authorized', inactive:'Unauthorized'};
    return statusAuth[status];
    
  }

  getSeverity(status){
   
    const severityObj = {active:'success', inactive:'danger'};

    return severityObj[status];
    
    
  }


  openNew() {
    this.userDialog = true;

  }



  hideDialog() {
    this.userDialog = false;

  }

  submit(){

    this.newFamilyMember.addressId = this.propertySelected.id;
    this.newFamilyMember.gender = this.genderSelected.code;
   
    this._userService.createFamily(this.token, this.newFamilyMember).subscribe({
      next: data => {
      
        if(data.status == 'success'){
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
          this.userDialog = false;
          this.getFamilies();
        }else{

          this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
          this.userDialog = true;
        }

      },
      error: error => {
        console.error('There was an error!', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
        this.userDialog = true;
      },
      complete: () => {
        console.log('Completed');
      }

    })
    


  }

  // family.addressId.condominioId.alias


  
  public addressInfo: any;
  public info: any;
  getFamilies(){


      
      this._userService.getFamilies(this.token).subscribe({
        next: data => {

          if(data.status == 'success'){

            this.addressInfo = [];
            this.info = [];

            for (let i = 0; i < data.message.length; i++) {
              
              data.message[i].addressId.forEach((element, index) => {

                  this.addressInfo.push({
                    id__: data.message[i]._id,
                    fullname: `${data.message[i].name} ${data.message[i].lastname}`,
                    familyUserCreatedAt: this._userService.dateFormat(data.message[i].createdAt),
                    current_status: data.message[i].status, 
                    addressId: element.condominioId._id,
                    alias: element.condominioId.alias,
                    address: `${element.condominioId.street_1}, ${element.condominioId.street_2}, ${element.condominioId.sector_name}, ${element.condominioId.province}, ${element.condominioId.zipcode}, ${element.condominioId.country} `, createdAt: this._userService.dateFormat(element.createdAt) , authorized: element.family_status,
                    total_properties: index + 1,
                  })

              });

       
              
            }


            console.log(this.addressInfo)
            this.nodata = data.message.length == 0 ? true : false;
            
          
          
          }

    
        },
        error: errors => {
          console.error('There was an error!', errors);
        },
        complete: () => {
          console.log('Completed');
        }
  
      })
      
  }
 
  public addProperty: any;
  showDialogToAddProperty(familyMember: any) {

    this.visibleUpdate = true;
    this.addProperty = familyMember;
   
   
    console.log(this.addProperty)
    console.log(this.visibleUpdate)
    

  }
  
  saveUser(event: any) {

    switch (event.label) {
      case 'Create':

        this.confirmationService.confirm({
          message: 'Are you sure you want to create this user?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
           
            this.submit()
        

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

    this.addProperty.addressId = this.propertySelected.id;

    this._userService.addNewProperty(this.token, this.addProperty).subscribe({
      next: data => {

      
        if(data.status == 'success'){

          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
          this.visibleUpdate = false;
          this.getFamilies();

        }else{
            
            this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
        }
      },
      error: error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
      },
      complete: () => {
        console.log('Add new property Completed');
      }
    })

   
  }

  submitFamilyUser(){
   
  }


}
