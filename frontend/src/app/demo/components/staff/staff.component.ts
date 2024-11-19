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

type StaffInfo = {

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

};

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
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
  public positionOptions:any[];
  public genderOptions: any[];
  public condominioList: any[];
  public loadingCondo: boolean;
  public token: string;
  public loginInfo: any;

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
    this.condominioList = [{label: '', name: ''}];

    this.staffInfo = {

      condo_id: '',
      name: '',
      lastname: '',
      gender: '',
      government_id: '',
      phone: '',
      position: '',
      email: '',
      password:'',
      password_verify: '',
      dob:''
      
    }
    this.loadingCondo = true;

    this.genderOptions = [
      {label:"Male", value:"male"},
      { label: "Female", value: "female" }
    ];
     
    this.token = this._userService.getToken();
    this.loginInfo = this._userService.getIdentity()

    this.positionOptions = [
        
        {label: 'Admin', value: 'admin'},
        {label: 'Staff', value: 'staff'},
        {label: 'Security', value: 'security'},
        {label: 'Maintenance', value: 'maintenance'},
        {label: 'Receptionist', value: 'receptionist'},
        {label: 'Cleaning', value: 'vleaning'},
        {label: 'Gardener', value: 'gardener'}
        
    ]
    

  }

  ngOnInit(): void {
    this.getAdminsProperties()
  }

  onsubmit(){

    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {

        this._staffService.create(this.staffInfo, this.token).subscribe({
          next: (response) => {
            if (response.status == 'success') {
              this._messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Staff successfully registered!', key:'br', life: 3000 });

              this.staffInfo = {

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

  public passval:boolean;
  public passMessage:string;
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

          this.condominioList =  response.message.map((element) => {
            return {
              label: element.alias.toUpperCase(), name: element._id
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
 