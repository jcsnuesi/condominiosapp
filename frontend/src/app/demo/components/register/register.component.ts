import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { MessageService } from 'primeng/api';
import { UserService } from '../../service/user.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [MessageService, UserService]
  
})
export class RegisterComponent{
  
  model:any[] = [];
  genero: any[] = [
    { name: 'F', code: 'F' },
    { name: 'M', code: 'M' }
  ]

  public status:string;
  public preview:boolean;
  public image:string;
  public userImage:any[] = [];

  

  selectedState: any = null;

  states_us: any[] = [

    { name: 'Arizona', code: 'Arizona' },
    { name: 'California', value: 'California' },
    { name: 'Florida', code: 'Florida' },
    { name: 'Ohio', code: 'Ohio' },
    { name: 'Washington', code: 'Washington' }

  ];

  dropdownItems = [
    { name: 'Option 1', code: 'Option 1' },
    { name: 'Option 2', code: 'Option 2' },
    { name: 'Option 3', code: 'Option 3' }
  ];

  cities1: any[] = [];

  cities2: any[] = [];

  city1: any = null;

  city2: any = null;

  public checked: boolean;
  public user:User;
  public messages = [{ severity: '', summary: '', details: '' }]

  constructor(
    private messageService: MessageService,
    private _userService: UserService
   ){

    this.user = new User('', '', '', '' , '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', false);
    this.user.country = 'Republica Dominicana'   
    this.preview = false
    this.checked = false
   
   
        
  }
 
  

  onSelect(file: any) {


      const reader = new FileReader();
     
      reader.onloadend = () => {
      const base64Data = reader.result as string;

      this.image = base64Data      
      this.status = "true"
      this.preview = true
    
      setTimeout(() => {
        this.status = 'false'
      }, 3000);
           
    };
  

    reader.readAsDataURL(file.files[0])
    this.userImage.push(file.files[0])
   
    this.messages[0].severity = 'success'
    this.messages[0].summary = 'Image uploaded successfully!'
    this.messages[0].details = 'Upload!'
    
  


  }

  onSubmit(form: any) {


    if (this.checked) {

      const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NTU1ODk2MjE3MTI5NzgxZmZmMTg3N2UiLCJlbWFpbCI6Impjc2FudG9zQG1haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkWTV4eG84VEZ3ckJJdi5CMk5qRzZwT0JIRy5OUHNWbEdWbVZKWDFrNFlOcDNLZ2FWcXNqYXUiLCJyb2xlIjoiU1VQRVJVU0VSIiwiaWF0IjoxNzAzMjkwMTA4fQ.ombBN8roQ0TZz2NFV42Cq8blm_EjLmarN_YLSKVf8G8"


      const formData = new FormData();

      if ((this.userImage).length > 0) {
        
        this.userImage.forEach(img => {        
          formData.append('avatar', img, img.name)
        })
      }
      
      
      for (const key in this.user) {

        formData.append(key, this.user[key])

      }



      this._userService.create(formData, token).subscribe(

        response => {

          if (response.status == 'success') {


            this.status = response.status

            this.messages[0].severity = 'success'
            this.messages[0].summary = 'Account created!'
            this.messages[0].details = 'created'
          }else{

            this.messages[0].severity = 'error'
            this.messages[0].summary = 'Account was not created'
            this.messages[0].details = 'Error'
          }
       

        },
        error => {

          this.messages[0].severity = error.status
          this.messages[0].summary = error.message
          this.messages[0].details = 'Error'
        }
      )



    }

  }
  

  termSelection(event:any){

    if (this.checked) {
      this.checked = true
      this.user.terms = true
    }else{
      this.checked = false
    }
 
   
  }

}
