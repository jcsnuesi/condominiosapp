import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
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
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DynamicTableComponent } from "../dynamic-table/dynamic-table.component";
import { FormatFunctions } from '../../service/formating_text';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PdfViewerModule } from 'ng2-pdf-viewer';



interface FamilyMembers {
  avatar: string,
  fullname: string,
  email: string ,
  phone: string,
  addressInfo: any[],
  role: string,  
  createdAt: string,
  status: string,
  actions: boolean
}

@Component({
  selector: 'app-family-member',
  standalone: true,
  imports: [
    PdfViewerModule,
    ProgressSpinnerModule,
    HasPermissionsDirective,
    ConfirmPopupModule,
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
    DialogModule,
    DynamicTableComponent
],
  templateUrl: '../dynamic-table/dynamic-table.component.html',
  styleUrl: './family-member.component.scss',
  providers: [
    MessageService,
    ConfirmationService,
    UserService]
})
export class FamilyMemberComponent implements OnInit  {
// ./family-member.component.html
  public userDialog: boolean;
  public visible_spinner: boolean;
  public dynamicHeaders: any;
  public propertyDetailsUser: any;
  public tableDataStructure!: FamilyMembers;
  private token: string;
  public authorizedUser: any;
  public propertyData: any;
  public selectedPermission!:Permissions[];
  public permission!:Permissions[];
  private identity:any;
  public genderOptions: { name: string; code: string; }[];
  public propertySelected: any;
  public genderSelected: any;
  public visible_dynamic: boolean;
  public nodata: boolean;
  public visibleUpdate: boolean;
  public addProperty: {_id: string, addressId: string };
  @Input() ownerIdInput!: string;
  public dataToSend: [{ name: string, lastname: string }];
  public addressInfo: any;
  public info: any;
  public bodyTableInfo: any[];
  public headertbl = "Family Members";
  public getSeverityColor: any;
  public _upperUfunction: any;
  public _stringFormating: any;
  public header_modal_aux = 'Family Member Details'; 
  public pdfSrc: any;
  

 



  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _userService: UserService
  ) {

    this.identity = this._userService.getIdentity()
    this.token = this._userService.getToken();
    this.propertyData = [];
    this.bodyTableInfo = [];
    this._stringFormating = new FormatFunctions();
    this.getSeverityColor = this._stringFormating.getSeverity;
    this._upperUfunction = this._stringFormating.upper;


    

    this.genderOptions = [
      {name:"Male", code:"M"},
      { name: "Female", code: "F" }
    ]

    console.log("Property",this.identity)

    this.addProperty = {
    _id: '',
      addressId: ''
    }

  }


  sendData() {


    return this.dataToSend;

  }
  

  public tblInfo: any;
  ngOnInit(): void {
   
    this.getFamilies();
    // this.sendData();
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
    this.visibleUpdate = false;

  }

  submit(){

    // this.newFamilyMember.addressId = this.propertySelected.id;
    // this.newFamilyMember.gender = this.genderSelected.code;
   
    // this._userService.createFamily(this.token, this.newFamilyMember).subscribe({
    //   next: data => {
      
    //     if(data.status == 'success'){
    //       this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
    //       this.userDialog = false;
    //       this.getFamilies();
    //     }else{

    //       this.messageService.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
    //       this.userDialog = true;
    //     }

    //   },
    //   error: error => {
    //     console.error('There was an error!', error);
    //     this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    //     this.userDialog = true;
    //   },
    //   complete: () => {
    //     console.log('Completed');
    //   }

    // })
    


  }

  editItem(event: any) {
    console.log(event)
    this.visible_dynamic = true;
  }

  

  getFamilies(){

     switch (this.identity.role) {
      case 'OWNER':

         this._userService.getFamilies(this.token).subscribe({
           next: data => {

             if (data.status == 'success') {

            
               // Asignamos las propiedades al dropdown
               for (let index = 0; index < this.identity.propertyDetails.length; index++) {
                 this.propertyData.push({ alias: this.identity.propertyDetails[index].addressId.alias, id: this.identity.propertyDetails[index].addressId._id })

               }


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
                     address: `${element.condominioId.street_1}, ${element.condominioId.street_2}, ${element.condominioId.sector_name}, ${element.condominioId.province}, ${element.condominioId.zipcode}, ${element.condominioId.country} `, createdAt: this._userService.dateFormat(element.createdAt), authorized: element.family_status,
                     total_properties: index + 1,
                   })

                 });



               }

               console.log("****************ADDRESS INFO*****************")
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
        
        break;
      case 'ADMIN':

        //  console.log("INPUT RECEIVED", this.ownerIdInput)
         this._userService.getFamiliesByOwnerId(this.token, this.ownerIdInput).subscribe({
           next: data => {

             console.log("****************ADDRESS INFO FOR ADMIN *****************")

          
             if (data.status == 'success') {
               console.log(data)
               this.dataToSend = data.message
               this.addressInfo = [];
               this.info = [];

               data.message.forEach((familyMember, index) => {

                 this.tableDataStructure = {
                   avatar: '',
                   fullname: '',                
                   email: '',
                   phone: '',
                   addressInfo: [],
                   role: '',
                   createdAt: '',
                   status: '',
                  actions: true
                 }

                 this.tableDataStructure.avatar = familyMember.avatar;
                 this.tableDataStructure.fullname = this._stringFormating.transform(familyMember.name) + ' ' + this._stringFormating. transform(familyMember.lastname)
                 this.tableDataStructure.phone = familyMember.phone
                 this.tableDataStructure.email = familyMember.email
                 this.tableDataStructure.status = familyMember.status
                 this.tableDataStructure.addressInfo.push(familyMember.addressId)                      
                 this.bodyTableInfo.push(this.tableDataStructure)



               })

               // excluir role,createdAt, addressInfo
               this.dynamicHeaders = Object.keys(this.tableDataStructure).filter((key) => key !== 'role' && key !== 'createdAt' && key !== 'addressInfo');
   


             }


           },
           error: errors => {
             console.error('There was an error!', errors);
           },
           complete: () => {
             console.log('Completed');
           }

         })
        
        break;
     
      default:
        break;
     }
    
      
  }
 
  
  showDialogToAddProperty(familyMember: any) {

    this.visibleUpdate = true;
    this.addProperty._id = familyMember.id__;
         

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


    // this.addProperty.addressId = this.propertySelected.id;
    // console.log("alreadyAdded", this.addProperty)

    const familyFound = this.addressInfo.filter(family => family.addressId === this.addProperty.addressId && family.id__ === this.addProperty._id);

    
    console.log("alreadyAdded", familyFound)
    console.log("alreadyAdded.......", this.addProperty._id)
    
    if (familyFound) {

        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Address already added to this user!', life: 3000 });
        
        
      }else{


        this.confirmationService.confirm({
          message: 'Do you want to confirm this action?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {

         

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

          },
          reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected this action', life: 3000 });
          }
        
        });


      }
 
 
     


   
  }

  submitFamilyUser(){
   
  }


}
