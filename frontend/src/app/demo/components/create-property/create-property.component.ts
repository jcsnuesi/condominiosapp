import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Condominio } from '../../models/condominios.model';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { MessagesModule } from 'primeng/messages';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
 
@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, InputTextModule, ButtonModule, MultiSelectModule, FileUploadModule, MessagesModule],
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.scss'],
  providers: [CondominioService, UserService]
})
export class CreatePropertyComponent implements OnInit {

  public condominioModel:Condominio;
  public condoType: any[]; 
  public condoSelected:any;
  public countrySelector:any[] = []
  public areas:any[]= []
  public selectedAreas:any;
  public image: any;
  public status: any;
  public messages = [{ severity: '', summary: '', details: '' }]
  public avatar:any;
  public token:string;


  constructor(
    private _condominioService: CondominioService,
    private _userService: UserService
  ){

    this.condominioModel = new Condominio('','','','','','','','','','','',[],[],[])
    'C:\Users\Hardware Gaming PC\Desktop\condominiosapp\frontend\src\assets\noimage2.jpeg'
    this.image = '../../assets/noimage2.jpeg'
    this.token = this._userService.getToken();

  }

  ngOnInit(): void {

    this.condominioModel.country = 'Dominican Republic'
    this.condoType = [
      { property: 'House'}, 
      { property: 'Tower'}, 
      { property: 'Apartments'}
    ]
    this.countrySelector = [
      {country:'Dominican Republic'}
    ]
    
    this.areas = [
      {areasOptions:'Pool'},
      {areasOptions:'Gym'},
      {areasOptions:'Park'},
      {areasOptions:'Playground'},
      { areasOptions:'Guest parking'}

    ]

    this.selectedAreas = this.areas[0] || undefined
    this.condoSelected = this.condoType[0]
    
  }

  // crear el modelo condominio *
  // crear el formulario *
  // enviar los datos a la api
  // recibir respuesta de la api

  submit(condominiumForm:any){

    this._condominioService.createCondominium(this.token, condominiumForm.form.value).subscribe(
      response => {
        console.log(response)
      },
      error => {
        console.error(error)
      }
    )


  }

  onSelect(file: any) {

    console.log(file)
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
    this.avatar = file.files[0]

    this.messages[0].severity = 'success'
    this.messages[0].summary = 'Image uploaded successfully!'
    this.messages[0].details = 'Upload!'

  }
}
