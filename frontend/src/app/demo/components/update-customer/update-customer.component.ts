import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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


@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.scss'],
  standalone:true,
  imports: [
    CommonModule,
    MessageModule,
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
  providers: [UserService]
})
export class UpdateCustomerComponent implements OnInit {

  private token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NTU1ODk2MjE3MTI5NzgxZmZmMTg3N2UiLCJlbWFpbCI6Impjc2FudG9zQG1haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkWTV4eG84VEZ3ckJJdi5CMk5qRzZwT0JIRy5OUHNWbEdWbVZKWDFrNFlOcDNLZ2FWcXNqYXUiLCJyb2xlIjoiU1VQRVJVU0VSIiwiaWF0IjoxNzAzNTU4MjY4fQ._qyJtXv90tZG_Cvx45xAErAW0371NN09_YxCDD8GJFg"
  public model: any[] = [];
  public genero: any[] = [
    { name: 'F', code: 'F' },
    { name: 'M', code: 'M' }
  ]

  @Input() sendDataToModal:any;

  public status: string;

  
  public image: any;
  public userImage: any[] = [];
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

  public checked: boolean;
  public user: User;
  public messages = [{ severity: '', summary: '', details: '' }]
  public info:any;
  public url:string;
  public avatarChanged:boolean = false;

  constructor( 
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute

  ) {
   
    this.url = global.url
   
    
  }
  
  ngOnInit(): void {

     
    this.image = this.url + 'main-avatar/' + this.sendDataToModal.avatar
    

  }

  updateUser(id:string){

    const formData = new FormData();
    if (this.avatarChanged) {
      
      formData.append('avatar', this.image, this.image.name)
    }

    for (const key in this.user) {

      formData.append(key, this.user[key])

    }

    this._userService.updateUser(this.token, id).subscribe(

      success => {

        if (success.status == 'success') {


          this.sendDataToModal = success.message
          
        }
        console.log(success)
      },
      error => {

        console.log(error)
      }
    )
    
  }
  

  onSelect(file: any) {


    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result as string;

      this.image = base64Data
      this.status = "true"
    
      

      setTimeout(() => {
        this.status = 'false'
      }, 3000);

    };


    reader.readAsDataURL(file.files[0])    
    this.avatarChanged = true

    this.messages[0].severity = 'success'
    this.messages[0].summary = 'Image uploaded successfully!'
    this.messages[0].details = 'Upload!'

  }


}
