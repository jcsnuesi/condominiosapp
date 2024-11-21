import { Component, OnInit } from '@angular/core';
import { TitleCasePipe, DatePipe, CurrencyPipe, UpperCasePipe, CommonModule, KeyValuePipe } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { UserService } from '../../service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatFunctions } from 'src/app/pipes/formating_text';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CalendarModule } from 'primeng/calendar';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { Table } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { HttpClient } from '@angular/common/http';
import { PipesModuleModule } from 'src/app/pipes/pipes-module.module';
import { StaffService } from '../../service/staff.service';
import { TabViewModule } from 'primeng/tabview';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CondominioService } from '../../service/condominios.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';

type StaffInfo = {
  createdBy: string;
  condo_id: string;
  name: string;
  lastname: string;
  gender: string;
  government_id: string;
  phone: string;
  position: string;
  email: string;
  password: string;
  password_verify: string;
  dob:'';
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
  fullname?: string;

};

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    FileUploadModule,
    ToastModule,
    ButtonModule,
    PasswordModule,
    CardModule,
    TabViewModule,
    InputGroupModule,
    InputGroupAddonModule,
    PipesModuleModule,
    CommonModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    TableModule,
    TitleCasePipe,
    DatePipe,
    FloatLabelModule,
    CalendarModule,
    CurrencyPipe,
    PanelModule,
    ConfirmDialogModule
  ],
  providers: [
    UserService,
    StaffService, 
    FormatFunctions,
    KeyValuePipe,
    CondominioService,
    MessageService,
    ConfirmationService
  ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent implements OnInit {

  public staffInfo: StaffInfo;
  public positionOptions: Array<{label: string, code: string}>;
  public genderOptions: Array<{ label: string, code: string }>;
  public condominioList: Array<{ label: string, code: string }>;
  public loadingCondo: boolean;
  public token: string;
  public loginInfo: any; 
  public loading: boolean;
  
  //Table settings
  public propertyDetailsVar: any[];
  public globalFilters: any;
  public headerTitleDict: any;
  public selectedPayment: any;
  public staffSelected: any[];



  public passval: boolean;
  public passMessage: string;
  public previwImage: any;

  constructor(
    private _userService: UserService,
    private _staffService: StaffService,
    private _formatFunctions: FormatFunctions,
    private _route: ActivatedRoute,
    private _router: Router,
    private _condominioService: CondominioService,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService
    
  ){

    this.condominioList = [{ label: '', code: ''}];
    this.staffSelected = [];
    

    this.previwImage =  '../../../assets/noimage2.jpeg';
    this.loadingCondo = true;

    this.genderOptions = [
      { label: "Male", code:"male"},
      { label: "Female", code: "female" }
    ];
     
    this.token = this._userService.getToken();
    this.loginInfo = this._userService.getIdentity()

    this.staffInfo = {
      createdBy: '',
      condo_id: '',
      name: '',
      lastname: '',
      gender: '',
      government_id: '',
      phone: '',
      position: '',
      email: '',
      password: '',
      password_verify: '',
      dob: ''


    }

    this.positionOptions = [
        
        {label: 'Admin', code: 'admin'},
        {label: 'Staff', code: 'staff'},
        {label: 'Security', code: 'security'},
        {label: 'Maintenance', code: 'maintenance'},
        {label: 'Receptionist', code: 'receptionist'},
        {label: 'Cleaning', code: 'vleaning'},
        {label: 'Gardener', code: 'gardener'}
        
    ]

    this.propertyDetailsVar = [];

    // table settings
    this.globalFilters = [
      'fullname',
      'phone',
      'gender',
      'condo_id',
      'government_id',
      'position',
      'status',
      'createdAt'
    ]
    
    this.loading = true;

    this.headerTitleDict = {
      'fullname': 'Fullname',
      'phone': 'Phone',
      'condo_id': 'Condominium',
      'position': 'Position',
      'status': 'Status',
      'createdAt': 'Start Date'
    }
    

  }

  ngOnInit(): void {
    this.getAdminsProperties();
    this.getStaffList();
  }

  clear(dt:any) {
    dt.clear();
  }

  getStaffList(){

    this._staffService.getStaff(this.token, this.loginInfo._id).subscribe({
      next: (response) => {

        if(response.status == 'success'){

          this.propertyDetailsVar = response.message.map((staff) => {

            console.log('STAFF:', staff)
            return {
              _id: staff._id,
              fullname: staff.name + ' ' + staff.lastname,
              phone: staff.phone,
              gender: staff.gender,
              government_id: staff.government_id,
              createdBy: staff.createdBy,
              condo_id: staff.condo_id?.alias ?? 'No Condo',
              position: staff.position,
              email: staff.email,
              status: staff.status,
              createdAt: staff.createdAt

            }
          });

          this.loading = false;
        }
      
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('Request completed getStaffList!');
    }
    });
  }

  getSeverity(status:string){

    return this._formatFunctions.getSeverityUser(status);

  }

  onUpload(event:any){

    const reader = new FileReader();

    reader.onloadend = (e) => {
      const base64Data = reader.result as string;
      this.previwImage = base64Data;
    
     
    }

    reader.readAsDataURL(event.files[0]);
    this.staffInfo.avatar = event.files[0];
  }

  onsubmit(form:NgForm){

    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {

        const formSfaff = new FormData();
        
        let keys = [
          'condo_id',
          'position',
          'gender'
        ]        
        // console.log("******************************************")
        // console.log(this.staffInfo)

       // Id of the company
        this.staffInfo.createdBy = this.loginInfo._id;
 
        for (const key in this.staffInfo) {
          
          if (keys.find((element) => element === key)) {
            formSfaff.append(key, this.staffInfo[key].code);
        }else{
          formSfaff.append(key, this.staffInfo[key]);
        }
      }
        formSfaff.forEach((value, key) => {
          console.log(key, value);
        });
     

        this._staffService.create(formSfaff, this.token).subscribe({
          next: (response) => {
            if (response.status == 'success') {
              this._messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Staff successfully registered!', key:'br', life: 3000 });

              form.reset();
              this.previwImage = '../../../assets/noimage2.jpeg';
            
              
            
            }
          },
          error: (error) => {
            this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staff was not registered!', key: 'br', life: 3000 });
            console.log(error);
          },
          complete: () => {
            console.log('Request completed!')
          }
        });
        
      },
      reject: () => {
        this._messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', key: 'br', life: 3000 });
      }
    });
  
    
   
  }

  verifyPassword(confirmPassword:any){

    let passwordInput = confirmPassword.target.value;
    this.passval = false;


    if (this.staffInfo.password === passwordInput){
      this.passMessage = "Password Match";
    
      this.passval = true;
  
    }else{
      this.passMessage = "Password does not match";
     
      this.passval = false;
    
    }

  }

  getAdminsProperties() {


    this._condominioService.getPropertyByAdminId(this.token, this.loginInfo._id).subscribe({
      next: (response) => {
      
        console.log('PROPERTIES:', response)

        if (response.status == 'success') {
          
          this.loadingCondo = false;

          this.condominioList = response.message.map((element) => {
            return {
              label: element.alias.toUpperCase(), code: element._id
            }
          });
         

        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('See property completed!')
      }
    });
  }
  
  

}
 