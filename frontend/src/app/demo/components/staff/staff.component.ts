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
    CurrencyPipe
  ],
  providers: [
    UserService,
    StaffService, 
    FormatFunctions,
    KeyValuePipe
  ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css'
})
export class StaffComponent {

  public staffInfo: StaffInfo;
  public positionOptions:any[];
  public genderOptions: any[];

  constructor(
    private _userService: UserService,
    private _staffService: StaffService,
    private _formatFunctions: FormatFunctions,
    private _route: ActivatedRoute,
    private _router: Router
  ){

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

    this.genderOptions = [
      {label:"Male", value:"male"},
      { label: "Female", value: "female" }
    ];
     

    this.positionOptions = [
        
        {label: 'Admin', value: 'Admin'},
        {label: 'Staff', value: 'Staff'},
        {label: 'Security', value: 'Security'},
        {label: 'Maintenance', value: 'Maintenance'},
        {label: 'Receptionist', value: 'Receptionist'},
        {label: 'Cleaning', value: 'Cleaning'},
        {label: 'Gardener', value: 'Gardener'}
        
    ]
    

  }

  onsubmit(){

    console.log(this.staffInfo);
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

}
 