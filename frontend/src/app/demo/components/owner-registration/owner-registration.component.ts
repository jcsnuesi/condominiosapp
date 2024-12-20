import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { OwnerModel } from '../../models/owner.model';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { StepperModule } from 'primeng/stepper';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { StepsModule } from 'primeng/steps';

@Component({
  selector: 'app-owner-registration',
  standalone: true,
  imports: [
    StepsModule,
    MessagesModule, 
    StepperModule,
    DialogModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    FileUploadModule,
    ButtonModule,
    ToastModule,
    FormsModule,
    CommonModule],
  providers: [
    CondominioService,
    UserService,
    MessageService, 
    ConfirmationService],
  templateUrl: './owner-registration.component.html',
  styleUrl: './owner-registration.component.scss'
})
export class OwnerRegistrationComponent implements OnInit, AfterViewInit {

  public ownerObj: OwnerModel;
  public image: any;
  private token: string;
  private identity: any;
  public apiUnitResponse!: boolean;
  public messageApiResponse: { message: string, severity: string };
  public genderOption: any;
  public parkingOptions: any;
  public property_typeOptions: any[] = []
  public addreesDetails!: { street_1: string, street_2: string, sector_name: string, city: string, province: string, country: string }
  @ViewChild('unitFormUno') basicInfo: NgForm; 
  @ViewChild('unitFormDos') propertyInfo: NgForm; 
  public items:any;
  public active: number = 0;
   

  constructor(
    private _condominioService: CondominioService,
    private _userService: UserService, 
    private _messageService: MessageService,
    private _confirmationService: ConfirmationService) {

    this.token = this._userService.getToken()
    this.identity = this._userService.getIdentity()

    this.ownerObj = new OwnerModel('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '')
   
    this.image = '../../assets/noimage2.jpeg'
    this.apiUnitResponse = false;
    this.messageApiResponse = { message: '', severity: '' }
    this.genderOption = [
      { gender: 'Male', code: 'm' },
      { gender: 'Female', code: 'f' }
    ];
    this.addreesDetails = { street_1: '', street_2: '', sector_name: '', city: '', province: '', country: '' }
  
    this.items = [
      {
        label: 'Personal Info'
      },
      {
        label: 'Reservation'
      },
      {
        label: 'Review'
      }
    ];
  }


  

  ngOnInit(): void {

    this.parkingOptions = []
    let propertyTypeLocal = JSON.parse(localStorage.getItem('property')).typeOfProperty
    this.ownerObj.propertyType = propertyTypeLocal.toUpperCase()
    
    for (let index = 1; index < 5; index++) {

      this.parkingOptions.push(index)

    }

    let property = JSON.parse(localStorage.getItem('property'))

    this.property_typeOptions = [
      { "name": "House", code: "house" },
      { "name": "Apartment", code: "apartment" },
      { "name": "Condo", code: "condo" },
      { "name": "Townhouse", code: "townhouse" },
      { "name": "Villa", code: "villa" },
      { "name": "Penthouse", code: "penthouse" },
    ]

    // Address Details - Card
    this.ownerObj.addressId = property._id
    this.addreesDetails.street_1 = property.street_1
    this.addreesDetails.street_2 = property.street_2
    this.addreesDetails.sector_name = property.sector_name
    this.addreesDetails.city = property.city
    this.addreesDetails.province = property.province
    this.addreesDetails.country = property.country
   
  }
    
  
  onSelect(file: any) {

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Data = reader.result as string;
      this.image = base64Data

    };

    reader.readAsDataURL(file.files[0])
    this.ownerObj.avatar = file.files[0]

  }


  confirmNewOwner(event: Event) {

    this._confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {

       
        this.onSubmitUnit()



      },
      reject: () => {
        this._messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });

  }

  onSubmitUnit() {

    const formData = new FormData()

    formData.append('avatar', (this.ownerObj.avatar != null ? this.ownerObj.avatar : 'noimage.jpeg'))

    formData.append('ownerName', this.ownerObj.ownerName)
    formData.append('lastname', this.ownerObj.lastname)
    formData.append('gender', this.ownerObj.gender)
    formData.append('id_number', this.ownerObj.id_number)
    // formData.append('dob', this.ownerObj.phone2)
    formData.append('phone', this.ownerObj.phone)
    formData.append('phone2', this.ownerObj.phone2)
    formData.append('email', this.ownerObj.email)
    formData.append('addressId', this.ownerObj.addressId)
    formData.append('apartmentUnit', this.ownerObj.apartmentsUnit)
    formData.append('parkingsQty', this.ownerObj.parkingsQty)
    formData.append('isRenting', this.ownerObj.isRenting)

    this._condominioService.createOwner(this.token, formData).subscribe({
      next: (response) => {

        if (response.status == 'success') {
          this._messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
          this.messageApiResponse.message = response.message
          this.messageApiResponse.severity = 'success'
          this.apiUnitResponse = true
          this.image = '../../assets/noimage2.jpeg'

        } else {
          this.messageApiResponse.message = response.message
          this.messageApiResponse.severity = 'danger'
          this.apiUnitResponse = true
        }
      },
      error: (error) => {
        this._messageService.add({ severity: 'warn', summary: 'Message for server', detail: 'Unit was not Created', life: 3000 });
        console.log(error)
      },
      complete: () => {
        this._messageService.add({ severity: 'success', summary: 'Success', detail: 'Unit Created', life: 3000 });


      }
    })


  }


  
 ngAfterViewInit() {

  //  this.propertyInfo.reset();
   this.basicInfo.reset();
 }

  
  reset(form: NgForm){
    console.log(form.reset())
    // this.propertyInfo.reset();
  }

  alertStatus(form: NgForm) {

   
    if (this.apiUnitResponse) {
 
      this.ownerObj = new OwnerModel('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '')
      this.ownerObj.avatar = '../../assets/noimage2.jpeg'
    
      this.apiUnitResponse = false
     
  

    } else {


      this.apiUnitResponse = true
    }

    form.reset()
   

  }


}
