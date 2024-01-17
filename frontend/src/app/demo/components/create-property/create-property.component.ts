import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Condominio } from '../../models/condominios.model';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, InputTextModule, ButtonModule, MultiSelectModule, FileUploadModule,  CardModule, RouterModule],
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

    this.status = 'showForm'
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
  // enviar los datos a la api *
  // recibir respuesta de la api *

  reloadWindows(){
    window.location.reload()
  }

  submit(condominiumForm:any){

    const formdata = new FormData()

    formdata.append('avatar', (this.avatar != null ? this.avatar : 'noimage.jpeg'))
    formdata.append('alias', condominiumForm.form.value.alias)
    formdata.append('typeOfProperty', condominiumForm.form.value.typeOfProperty.property)
    formdata.append('phone', condominiumForm.form.value.phone)
    formdata.append('phone2', condominiumForm.form.value.phone2)
    formdata.append('street_1', condominiumForm.form.value.street_1)
    formdata.append('street_2', condominiumForm.form.value.street_2)
    formdata.append('sector_name', condominiumForm.form.value.sector_name)
    formdata.append('city', condominiumForm.form.value.city)
    formdata.append('zipcode', condominiumForm.form.value.zipcode)
    formdata.append('province', condominiumForm.form.value.province)
    formdata.append('country', condominiumForm.form.value.country.country)
    formdata.append('socialAreas', condominiumForm.form.value.socialAreas.map(areas =>  areas.areasOptions))


    this._condominioService.createCondominium(this.token, formdata).subscribe(
      response => {

        if (response.status == 'success') {

          this.status = response.status
         
          condominiumForm.reset()
          
          
        }
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


  }
}
