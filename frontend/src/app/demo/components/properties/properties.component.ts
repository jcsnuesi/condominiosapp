import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';
import { global } from '../../service/global.service';
import {FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';




@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
  standalone:true,
  imports: [DataViewModule, CommonModule, 
    FormsModule],
  providers: [UserService]
})
export class PropertiesComponent implements OnInit {

  public products!: any[];  
  public token: string = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2NTU1ODk2MjE3MTI5NzgxZmZmMTg3N2UiLCJlbWFpbCI6Impjc2FudG9zQG1haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkWTV4eG84VEZ3ckJJdi5CMk5qRzZwT0JIRy5OUHNWbEdWbVZKWDFrNFlOcDNLZ2FWcXNqYXUiLCJyb2xlIjoiU1VQRVJVU0VSIiwiaWF0IjoxNzAzNTU4MjY4fQ._qyJtXv90tZG_Cvx45xAErAW0371NN09_YxCDD8GJFg";

  public layout: string = 'list'
  public identity:any;
  public url:any;


  constructor(
    private _userService: UserService){
    this.url = global.url
    
  }

  ngOnInit(): void {

    
  }

  getCondominios(){

    this._userService.getProperties(this.token, this.identity._id).subscribe(

      response => {

        this.products = response.message
        console.log(this.products)
      },
      error => {
        console.log(error)
      }
    )
  }

}
