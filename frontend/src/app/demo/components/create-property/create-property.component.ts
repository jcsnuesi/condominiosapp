import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Condominio } from '../../models/condominios.model';
import { FormsModule, NgForm } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { FileUploadModule } from 'primeng/fileupload';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { CardModule } from 'primeng/card';
import { RouterModule, Router } from '@angular/router';
 
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
  public condoType:any[]; 
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
    private _userService: UserService,
    private _router: Router
  ){

    this.condominioModel = new Condominio('', '','','','','','','','','','','',[],[],null)
    
    this.image = '../../assets/noimage2.jpeg'
    this.token = this._userService.getToken();

  }

  ngOnInit(): void {

    this.status = 'showForm'
    this.condominioModel.country = 'Dominican Republic'
    
    this.condoType = [
      { property: 'House' },
      { property: 'Tower' },
      { property: 'Apartments' }
    ]; 

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
    
    
  }

  // crear el modelo condominio *
  // crear el formulario *
  // enviar los datos a la api *
  // recibir respuesta de la api *

  reloadWindows(){
    this._router.navigate(['/create-property'])
  }

  public areaSocialString: any;
  submit(condominiumForm:NgForm){

    const formdata = new FormData()
    
    formdata.append('avatar', (this.avatar != null ? this.avatar : 'noimage.jpeg'))
    formdata.append('alias', this.condominioModel.alias)
    formdata.append('typeOfProperty', this.condominioModel.typeOfProperty.property )
    formdata.append('phone', this.condominioModel.phone)
    formdata.append('phone2', this.condominioModel.phone2)
    formdata.append('street_1', this.condominioModel.street_1)
    formdata.append('street_2', this.condominioModel.street_2)
    formdata.append('sector_name', this.condominioModel.sector_name)
    formdata.append('city', this.condominioModel.city)
    formdata.append('zipcode', this.condominioModel.zipcode)
    formdata.append('province', this.condominioModel.province)
    formdata.append('country', this.condominioModel.country.country )
    
    this.condominioModel.socialAreas.forEach(areas => {
      formdata.append('socialAreas', areas.areasOptions)
    });
    formdata.append('mPayment', this.condominioModel.mPayment)


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
    console.log(this.avatar)


  }
}
