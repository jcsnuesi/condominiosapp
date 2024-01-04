import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Form, FormsModule, NgForm } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { CalendarModule } from "primeng/calendar";
import { ChipsModule } from "primeng/chips";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { User } from '../../models/user.model';
import { UserService } from '../../service/user.service';
import { MessageModule } from 'primeng/message';
import { ActivatedRoute } from '@angular/router';
import { global } from '../../service/global.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';




@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    ToastModule,
    MessageModule,
    ConfirmDialogModule,
    CheckboxModule,
    FormsModule,   
    AutoCompleteModule,
    CalendarModule,
    ChipsModule,
    DropdownModule,
    InputMaskModule,
    InputNumberModule,
    CascadeSelectModule,
    MultiSelectModule,
    InputTextareaModule,
    FileUploadModule,
    InputTextModule,
    DividerModule],
  providers: [UserService, MessageService, ConfirmationService]
})
export class UpdateCustomerComponent implements OnInit {

  private token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NTU1ODk2MjE3MTI5NzgxZmZmMTg3N2UiLCJlbWFpbCI6Impjc2FudG9zQG1haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkWTV4eG84VEZ3ckJJdi5CMk5qRzZwT0JIRy5OUHNWbEdWbVZKWDFrNFlOcDNLZ2FWcXNqYXUiLCJyb2xlIjoiU1VQRVJVU0VSIiwiaWF0IjoxNzAzNTU4MjY4fQ._qyJtXv90tZG_Cvx45xAErAW0371NN09_YxCDD8GJFg"
  public model: any[] = [];
  public genero: any[] = [
    { name: 'F', code: 'F' },
    { name: 'M', code: 'M' }
  ]

  public checked:boolean = false;

  @Input() sendDataToModal:any;
  @Output() customEvent: EventEmitter<string> = new EventEmitter<string>();

  

  public status: string;
  public checkBoxMsg: string = '¿Delete account permanently?'

  
  public image: any;
  public selectedState: any = null;
  public states_us: any[] = [

    { name: 'Arizona', code: 'Arizona' },
    { name: 'California', value: 'California' },
    { name: 'Florida', code: 'Florida' },
    { name: 'Ohio', code: 'Ohio' },
    { name: 'Washington', code: 'Washington' }

  ];

  public  dropdownItems = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
  ];

  public cities1: any[] = [];

  public  cities2: any[] = [];

  public city1: any = null;

  public city2: any = null;


  public user: User;
  public messages = [{ severity: '', summary: '', details: '' }]
  public info:any;
  public url:string;
  public avatarChanged:boolean = false;
  public btnSetting: any[] = [];
  public btnLookAndFeels: any;
  public changepassword:boolean;
  public match:any = {value:false, message:'Does not match', validation:false, class:'error'};
  public userImage:any;
  public disabled:boolean;
 

  constructor( 
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService

  ) {
   
    this.url = global.url
    this.btnSetting = [
      { icon: 'times', label: 'Delete account', class: 'danger' },
      { icon: 'save', label: 'Update', class: 'success' },
      { icon: 'power-off', label: 'Reactive', class: 'primary' }]
    this.changepassword =  false
    
       
  }



  ngOnInit(): void {

    console.log(this.sendDataToModal.status)

    if (this.sendDataToModal.status == 'active') {
      
      this.disabled = true
      this.btnLookAndFeels = this.btnSetting[1]
      
    }else{

      this.disabled = false
      this.btnLookAndFeels = this.btnSetting[2]

    }

    this.image = this.url + 'main-avatar/' + this.sendDataToModal.avatar

 
   
  }

  // Habilita las inputs para cambiar la password
  passwordChanger(event:any){

    this.changepassword = event.checked
  

  }

  
  onPasswordChange(){

    const newpass = (document.getElementById('new_password') as HTMLInputElement).value 
    const matchpass = (document.getElementById('rpassword') as HTMLInputElement).value
    

    if (newpass === matchpass) {
      
    
      this.match.value = true
      this.match.message = 'Matched!'
      this.match.validation = true
      this.match.class = 'success'
     
    }else{

      this.match.value = true
      this.match.message = 'Does not match'
      this.match.validation = false
      this.match.class = 'error'
     
    }
  }

  // Cambia el aspecto del boton
  delSelection(event){

    this.btnLookAndFeels = this.btnSetting[event.checked == false ? 1 : 0]
    
  }

  onDelete(id){

    this._userService.deleteUser(this.token, id).subscribe(

      account => {

        if(account.status == 'success')
        
        this.customEvent.emit('update');
        this.disabled = false
        this.checkBoxMsg = "¿Reactive account?"
        this.btnLookAndFeels = this.btnSetting[2]

       

      },
      error => {

        console.log(error)

      }
    )
   

  }

  reactive(){

    this._userService.reactiveAccount(this.token, { id: this.sendDataToModal._id,status:'active'}).subscribe(

      reactived => {
      
     
        if (reactived.status == 'success') {
          this.customEvent.emit('update');
          this.disabled = true
          this.btnLookAndFeels = this.btnSetting[1]
          this.checkBoxMsg = '¿Delete account permanently?'

        }

      },
      error => {
        console.log(error)
      }
    )
  }

  onUpdate(dataform){

  

    delete dataform.form.value.selection
    delete dataform.form.value.changePass

    var formData = new FormData();
    formData.append('_id', this.sendDataToModal._id)
    formData.append('avatar', this.userImage)

    if (this.changepassword) {

      if (this.match.validation) {

        formData.append('password', dataform.form.value.password)
        formData.append('new_password', dataform.form.value.new_password)
      } else {

        this._messageService.add({ severity: 'error', summary: 'Not updated', detail: 'New password must macth', life: 3000 });
      }


    }

    delete dataform.form.value.password
    delete dataform.form.value.new_password
    delete dataform.form.value.rpassword

    for (const key in dataform.form.value) {

      if (dataform.form.value[key] != undefined || dataform.form.value[key] != null) {

        formData.append(key, dataform.form.value[key])

      }

    }

    
    this._userService.updateUser(this.token, formData).subscribe(

      response => {

        if (response.status == 'success') {
          this._messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Info updated' });

          this.customEvent.emit('update');

        } else {

          this._messageService.add({ severity: 'error', summary: 'Not updated', detail: response.error.message, life: 3000 });
        }
      },
      error => {
        this._messageService.add({ severity: 'error', summary: 'Not updated', detail: error.error.message, life: 3000 });
        console.log(error)
      }

    )

 

  }

  confirm(event: Event, dataform: NgForm) {

    
    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {

        if (this.btnLookAndFeels.icon == 'times') {
        
          this.onDelete({ id: this.sendDataToModal._id })
          
        }else if(this.disabled == false){

         this.reactive()

        }        
        else{
        
          this.onUpdate(dataform)
        }




      },
      reject: () => {
        this._messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    }); 

  

  }
  

  onSelect(file: any) {


    const reader = new FileReader();
    

    reader.onloadend = () => {

      const base64Data = reader.result as string;

      this.image = base64Data
      this.status = 'true'
    
      setTimeout(() => {
        this.status = 'false'
      }, 3000);

    };


    reader.readAsDataURL(file.files[0])
    this.userImage= file.files[0]
    
    this.messages[0].severity = 'success'
    this.messages[0].summary = 'Image uploaded successfully!'
    this.messages[0].details = 'Upload!'

  }


}
