import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
import { global } from '../../service/global.service';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';

type StaffInfo = {
  _id: string;
  createdBy?: string;
  condo_id: string;
  name: string;
  lastname: string;
  gender: string;
  government_id: string;
  phone: string;
  position: string;
  email: string;
  password?: string;
  password_verify: string;
  dob:'';
  createdAt?: string;
  updatedAt?: string;
  avatar?: string;
  fullname?: string;
  status?: string;

};

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    DialogModule,
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
    PanelModule,
    ConfirmDialogModule,
    HasPermissionsDirective
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
export class StaffComponent implements OnInit, AfterViewInit {

  public staffInfo: StaffInfo;
  public positionOptions: Array<{label: string, code: string}>;
  public genderOptions: Array<{ label: string, code: string }>;
  public condominioList: Array<{ label: string, code: string }>;
  public loadingCondo: boolean;
  public token: string;
  public loginInfo: any; 
  public loading: boolean;
  
  //Table settings
  public propertyDetailsVar: Array<StaffInfo>;
  public globalFilters: any;
  public headerTitleDict: any;
  // public selectedPayment: StaffInfo;
  public staffSelected: StaffInfo[] = [];
  public url: string;


  public visibleStaff: boolean;
  public statusStaff:Array<{label: string, code: string}>;


  public passval: boolean;
  public passMessage: string;
  public previwImage: any;
  public statusApi:boolean;

  public staffVisibleBackBtn: boolean;

  @ViewChild('genderRef') genderDropDown!: ElementRef;
  @ViewChild('positionRef') genderPositionRef!: ElementRef;
  @ViewChild('buildingRef') buildingRef!: ElementRef;
  @ViewChild('editGenderRef') editGenderRef!: ElementRef;
  @ViewChild('editpositionRef') editpositionRef!: ElementRef;
  @ViewChild('editbuildingRef') editbuildingRef!: ElementRef;
  @ViewChild('editStatusRef') editStatusRef!: ElementRef;

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
 
    
    this.url = global.url;
    

    this.previwImage =  '../../../assets/noimage.jpeg';
    this.loadingCondo = true;
    this.staffVisibleBackBtn = false;

    this.genderOptions = [
      { label: "Male", code:"male"},
      { label: "Female", code: "female" }
    ];

    this.statusStaff = [
      {label: 'Active', code: 'active'},
      {label: 'Inactive', code: 'inactive'}
    ]
     
    this.token = this._userService.getToken();
    this.loginInfo = this._userService.getIdentity()

    this.staffInfo = {
      _id: '',
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

    this.dataToUpdate = {
      _id: '',
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
      dob: '',
      currentPassword:''
    }
    

    this.positionOptions = [
        
        {label: 'Admin', code: 'admin'},
        {label: 'Staff', code: 'staff'},
        {label: 'Security', code: 'security'},
        {label: 'Maintenance', code: 'maintenance'},
        {label: 'Receptionist', code: 'receptionist'},
        {label: 'Cleaning', code: 'vleaning'},
        {label: 'Accounting', code: 'accounting'},
        {label: 'Gardener', code: 'gardener'}
        
    ]

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

  ngAfterViewInit() {
    

    const dropdownElement = this.genderDropDown.nativeElement.querySelector('.p-inputwrapper').querySelector('.p-dropdown');
    const dropdPositionRef = this.genderPositionRef.nativeElement.querySelector('.p-inputwrapper').querySelector('.p-dropdown');
    const dropdbuildingRef = this.buildingRef.nativeElement.querySelector('.p-inputwrapper').querySelector('.p-dropdown');
    const dropdeditGenderRef = this.editGenderRef.nativeElement.querySelector('.p-inputwrapper').querySelector('.p-dropdown');
    const dropdeditpositionRef = this.editpositionRef.nativeElement.querySelector('.p-inputwrapper').querySelector('.p-dropdown');
    const dropeditbuildingRef = this.editbuildingRef.nativeElement.querySelector('.p-inputwrapper').querySelector('.p-dropdown');
    const dropeditStatusRef = this.editStatusRef.nativeElement.querySelector('.p-inputwrapper').querySelector('.p-dropdown');
    
 
    if (dropdownElement) {
      [dropeditStatusRef,dropeditbuildingRef,dropdeditpositionRef,dropdownElement, dropdPositionRef, dropdbuildingRef, dropdeditGenderRef].forEach((element) => {
        element.style.width = '100%';
        element.style.borderRadius = '0';
      });  
      
    
    } else {
      console.error('Dropdown element not found inside the template.');
    }
  }

  ngOnInit(): void {

    let condominioInfo = JSON.parse(localStorage.getItem('property'));
    // Obtiene el id del condominio
    this._route.params.subscribe(params => {

      let condoId = params['id'];
      let ownerId = params['ownerId'];
      console.log('CONDOID:', ownerId);

      if(ownerId != undefined){
   
        this.ownerId = ownerId;
        this.getStaffByOwerCondo();
      }
    
      if (condoId != undefined){
        // Carga la lista de staff por condominio
        this.condo_id = condoId;
        this.getStaffByCondoId();
        this.condominioList = [{
          label: condominioInfo?.alias.toUpperCase(), 
          code: condominioInfo?._id
        }]       
        this.loadingCondo = false;        
  
      } else if (condoId == undefined && ownerId == undefined){
        // Carga la tabla de staff con todos los registros que existe por administrador componente
        this.getStaffList();  
        // Carga la lista de todos condominios de este administrador
        this.getAdminsProperties();

      }      

    });
  }
  public ownerId: string;
  
  getStaffByOwerCondo(){

    this._staffService.getStaffByOwnerCondo(this.token, this.ownerId).subscribe({
      next: (response) => {
     
        if (response.status == 'success') {

          this.propertyDetailsVar = response.message.map((staff) => {
            return {
              _id: staff._id,
              fullname: staff?.name + ' ' + staff?.lastname,
              phone: staff.phone,
              gender: staff.gender,
              government_id: staff.government_id,
              createdBy: staff.createdBy,
              condo_id: staff.condo_id?.alias ?? 'No Condo',
              position: staff.position,
              email: staff.email,
              status: staff.status,
              createdAt: staff.createdAt,
              avatar: staff.avatar

            }
          });

          this.loading = false;
        }
    },error: (error) => {
      console.log(error);
    }
  });
  }

  clear(dt:any) {
    dt.clear();
    
  }

  backToDashboard(){
    this._router.navigate(['/home', this.condo_id ]);
  }

  public condo_id: string;
  
  // Carga los staff por condominio
  getStaffByCondoId() {

    this.loading = true;
    this.staffVisibleBackBtn = true;

    this._staffService.getStaffByCondo(this.token, this.condo_id).subscribe({

      next: (response) => {
        console.log('STAFF->:', response);
        if (response.status == 'success') {

          this.propertyDetailsVar = response.message.map((staff) => {
            return {
              _id: staff._id,
              fullname: staff?.name + ' ' + staff?.lastname,
              phone: staff.phone,
              gender: staff.gender,
              government_id: staff.government_id,
              createdBy: staff.createdBy,
              condo_id: staff.condo_id?.alias ?? 'No Condo',
              position: staff.position,
              email: staff.email,
              status: staff.status,
              createdAt: staff.createdAt,
              avatar: staff.avatar

            }
          });

          this.loading = false;

          console.log('STAFF---->:', response.message);
        }

      },
      error: (error) => {
        console.log(error);
      }
        
          
    });

    
  }

  genderFormat(genderRaw:any):string{
      
    return this._formatFunctions.genderPipe(genderRaw);

  }

  public dataToUpdate: any;
  public previewGender:any;  

  showDialog(info: any) {

    this.visibleStaff = true;  
    this.passwordMatch = false;  
    this.dataToUpdate = {};
    
    let { ...res } = info;

    this.dataToUpdate = {
      _id: res._id,
      condo_id: this.condominioList.find((condo) => condo.label.toLowerCase() === res.condo_id),
      name: res.fullname.split(' ')[0],
      lastname: res.fullname.split(' ')[1],
      gender: this.genderOptions.find((gend) => gend.code.startsWith(res.gender)),
      dob: new Date(),
      government_id: res.government_id,
      phone: res.phone,
      position: this.positionOptions.find((pos) => pos.code == res.position),
      email: res.email,
      status: this.statusStaff.find((stat) => stat.code == res.status)
    }; 
   
    this.previwImageEdit = this.url + 'avatar-staff/' + res.avatar;      

  }

  // Carga los staff por administradora
  getStaffList(){

    this._staffService.getStaff(this.token, this.loginInfo._id).subscribe({
      next: (response) => {

        if(response.status == 'success'){          

          this.propertyDetailsVar = response.message.map((staff) => {
            return {
              _id: staff._id,
              fullname: staff?.name + ' ' + staff?.lastname,
              phone: staff.phone,
              gender: staff.gender,
              government_id: staff.government_id,
              createdBy: staff.createdBy,
              condo_id: staff.condo_id?.alias ?? 'No Condo',
              position: staff.position,
              email: staff.email,
              status: staff.status,
              createdAt: staff.createdAt,
              avatar: staff.avatar
              
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
    this.dataToUpdate.avatar = event.files[0];
    console.log('AVATAR:', this.dataToUpdate.avatar);
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

        
        this.staffInfo.createdBy = this.loginInfo._id;
 
        for (const key in this.staffInfo) {
          
          if (keys.find((element) => element === key)) {
            formSfaff.append(key, this.staffInfo[key].code);
        }else{
            formSfaff.append(key, this.staffInfo[key]);
        }

      }

        this._staffService.create(formSfaff, this.token).subscribe({
          next: (response) => {
            if (response.status == 'success') {
              this._messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Staff successfully registered!', key:'br', life: 3000 });

              form.reset();
              this.getStaffList();
              this.previwImage = '../../../assets/noimage.jpeg';
            }
          },
          error: (error) => {
            this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staff was not registered!', key: 'br', life: 3000 });
            console.log(error);
          },
          complete: () => {
            this.previwImage = '../../../assets/noimage2.jpeg';
            console.log('Request completed!')
          }
        });
        
      },
      reject: () => {
        this._messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', key: 'br', life: 3000 });
      }
    });
  
    
   
  }

  public previwImageEdit: any;
  public currentPasswordMsg: string;
  update(form: NgForm){

    const formdata = new FormData();

    let keys = [
      'condo_id',
      'position',
      'gender',
      'status'
    ]   
  
    for (const key in this.dataToUpdate) {

      if (keys.includes(key)) {
        formdata.append(key, this.dataToUpdate[key].code);
      } else {
        formdata.append(key, this.dataToUpdate[key]);
      }
    }

 
    

    this._staffService.updateStaff(this.token, formdata).subscribe({
      next: (response) => {

        if (response.status == 'success') {
          this._messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Staff successfully updated!', key: 'br', life: 3000 });
          this.visibleStaff = false;
          form.reset();
          this.staffPipe(response);
        }

      },
      error: (error) => {
        this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staff was not updated!', key: 'br', life: 3000 });
      
        if (error.error.message == 'Password incorrect') {

          this.statusApi = true;
          this.currentPasswordMsg = error.error.message;
          setTimeout(() => {
            this.statusApi = false;
          }, 6000);
        }


      },
      complete: () => {
        console.log('Request completed!')
      }
    });

  }

  verifyPasswordInput(confirmPassword:any){

    let passwordInput = confirmPassword.target.value;
    this.passval = false;


    if (this.dataToUpdate.password === passwordInput){
      this.passMessage = "Password Match";
    
      this.passval = true;
  
    }else{
      this.passMessage = "Password does not match";
     
      this.passval = false;
    
    }

  }

  public passwordMatch: boolean;

  verifyPasswordAPI(confirmPassword:any){

    let passwordInput = '';
    passwordInput += confirmPassword.target.value;
 
    if (passwordInput.length >= 8) {
      
      let data = { _id: this.dataToUpdate._id, currentPassword: passwordInput };
      
      this._staffService.verifyPassword(this.token, data).subscribe({
        next: (response) => {
          
          if (response.status == 'success') {
            this.statusApi = true;
            this.passwordMatch = true;
            this.currentPasswordMsg = "Password Match";
            setTimeout(() => {
              this.statusApi = false;
            }, 6000);
    
          }
       
        },
        error: (error) => {
          console.log(error);
          this.statusApi = true;
          this.passwordMatch = false;
          this.currentPasswordMsg = error.error.message;
          setTimeout(() => {
            this.statusApi = false;
          }, 6000);
        },
        complete: () => {
          console.log('Request completed!')
        }
      });

    }  else{
      this.currentPasswordMsg = "Password does not match";
      this.passval = false;
    }

}

  getAdminsProperties() {

    this.loadingCondo = true;

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

  deleteStaff() {

   
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "pi pi-check",
      rejectIcon: "pi pi-times",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        console.log("STAFF SELECTED:", this.staffSelected);
        this._staffService.deleteStaff(this.token, this.staffSelected).subscribe({
          next: (response) => {
            
            if(response.status == 'success'){
              this._messageService.add({ severity: 'success', summary: 'Staff inactived', detail: 'Staff was successfully inactivated', key: 'br', life: 3000 });
            }
            this.staffPipe(response);
          },
          error: (error) => {
            this._messageService.add({ severity: 'error', summary: 'Error', detail: 'Staff was not deleted!', key: 'br', life: 3000 });
            console.log(error);
          }

        });
      },
      reject: () => {
        this._messageService.add({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', key: 'br', life: 3000 });
      }
    });


  }

  
  staffPipe(response:any){

    if (response.status == 'success') {

  
      if (this.condo_id != undefined) {
        this.getStaffByCondoId();
      } else {

        this.getStaffList();
      }
    }
  }
  
  

}
 