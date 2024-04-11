import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CondominioService } from '../../service/condominios.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { global } from '../../service/global.service';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [CommonModule, TableModule, FormsModule],
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss'],
  providers: [CondominioService, UserService]
})
export class PropertyDetailsComponent implements OnInit {

  public customers:any;
  public buiding: { alias: string, avatar: string } = { alias: '', avatar: '' }
  public url:string;
  public total:number;
 public items:any[] = [
    { label: 'Account info', icon: 'pi pi-fw pi-info-circle', routerLink: 'details' }
  ]

  constructor(
    private _userService: UserService,
    private _condominioService: CondominioService,
    private _activatedRoute: ActivatedRoute){

    this.url = global.url
    }

  ngOnInit(): void {

    this._activatedRoute.params.subscribe(param => {

      let id = param['id']   
      
      this._condominioService.getBuilding(id, this._userService.getToken()).subscribe(
        response => {
        
          if (response.status == 'success') {
            
            this.customers = response.message[0].owners
            this.buiding.alias = response.message[0].alias
            this.buiding.avatar = response.message[0].avatar
            this.total = (response.message[0].owners).length
           
            console.log(response.message)
          }
        },
        error => {
          console.log(error)
        }
      )
    })

    
  }


  calculateCustomerTotal(customer:any){

  }

 
  


}
