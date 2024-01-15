import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Condominio } from '../../models/condominios.model';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
 
@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, InputTextModule,ButtonModule, MultiSelectModule],
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.scss']
})
export class CreatePropertyComponent implements OnInit {

  public condominioModel:Condominio;
  public condoType: any[]; 
  public condoSelected:any;
  public countrySelector:any[] = []
  public areas:any[]= []
  public selectedAreas:any;
 


  constructor(){

    this.condominioModel = new Condominio('','','','','','','','','','','',[],[],[])

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

  submit(CondominiumForm:FormData){

    console.log(CondominiumForm)
  }


}
