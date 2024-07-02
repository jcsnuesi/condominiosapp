import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { ConfirmationService, MenuItem, PrimeNGConfig } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ActivatedRoute } from '@angular/router';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { CookieService } from 'ngx-cookie-service';
import { property_details } from '../../models/property_details_type';
import { dateTimeFormatter } from '../../service/datetime.service';
import { global } from '../../service/global.service';
import { MessageService } from 'primeng/api';
import { OwnerModel } from '../../models/owner.model';
import { NgForm } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [
        CondominioService,
        UserService,
        MessageService, ConfirmationService],
    styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

    files = [];

    totalSize: number = 0;

    totalSizePercent: number = 0;

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;
    ownerObj:OwnerModel;
    public property_typeOptions:any[] = []

    subscription!: Subscription;
    public buildingDetails: property_details;
    public units:number;
    private token:string;
    public dateFormatted:string;
    public currentIcon:string;
    public gbColor:string;
    public url:string;
    public parkingOptions:any;
  
    public dialogDinamicComponent:any;

    
    constructor(
        private _sanitizer: DomSanitizer,
        private productService: ProductService, 
        public _condominioService: CondominioService,
        public _userService: UserService,
        public layoutService: LayoutService,
        private _activatedRoute:ActivatedRoute,
        private _cookieService: CookieService,
        private messageService: MessageService,
        private _config: PrimeNGConfig,
        private confirmationService: ConfirmationService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });


        this.token = this._userService.getToken()
        this.currentIcon = 'pi-building'
        this.gbColor = 'blue-100'
        this.url = global.url
        this.ownerObj = new OwnerModel('', '', '', '', '', '', '', '', '', '', '','','')
        this.image = '../../assets/noimage2.jpeg'
        this.addreesDetails = { street_1: '', street_2: '', sector_name: '', city: '', province: '', country: '' }
       

    }


    @Output() propertyInfoEvent: EventEmitter<any> = new EventEmitter();
    
    propertyData(data) {
        // emit data to parent component
        this.propertyInfoEvent.emit(data);
    }

    confirm1(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: "none",
            rejectIcon: "none",
            rejectButtonStyleClass: "p-button-text",
            accept: (form) => {
                this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
                
               
               this.onSubmitUnit(form)
                
            },
            reject: () => {
                this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
        });
    }


    onSubmitUnit(form:NgForm){

        console.log(this.ownerObj)
        form.reset()
        return
        const formData = new FormData()
        formData.append('avatar', (this.ownerObj.avatar != null ? this.ownerObj.avatar : 'noimage.jpeg'))
        formData.append('name', this.ownerObj.ownerName)
        formData.append('lastname', this.ownerObj.lastname)
        formData.append('gender', this.ownerObj.gender['code'])
        // formData.append('dob', this.ownerObj.phone2)
        formData.append('phone', this.ownerObj.phone)
        formData.append('phone2', this.ownerObj.phone2)
        formData.append('email', this.ownerObj.email)
        formData.append('addressId', this.ownerObj.addressId)
        formData.append('apartmentUnit', this.ownerObj.apartmentsUnit)
        formData.append('parkingsQty', this.ownerObj.parkingsQty)
        formData.append('isRenting', this.ownerObj.isRenting)

    
        formData.forEach((value, key) => {
            console.log(key + ' ' + value)
        })
    
return
        this._condominioService.createOwner(this.token, formData ).subscribe({
            next: (response) => {
                console.log(response)
                if (response.status == 'success') {
                    this.ownerObj = response.message
                   
                  
                }
        },
        error: (error) => {
            this.messageService.add({ severity: 'warn', summary: 'Message for server', detail: 'Unit was not Created', life: 3000 });
            console.log(error)
        },
        complete: () => {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Unit Created', life: 3000 });
         
            
        }
    })
}
    

    onMouseOver(): void {
        this.currentIcon = 'pi-plus';
        this.gbColor = 'yellow-200'
    }
    onMouseOut(): void {

        this.currentIcon = 'pi-building'
        this.gbColor = 'blue-100'

    }

    image: any;
    onSelect(file: any) {

        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Data = reader.result as string;
            this.image = base64Data       
          
        };

        reader.readAsDataURL(file.files[0])
        this.ownerObj.avatar = file.files[0]
        
    }

    onTemplatedUpload() {
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
    }


    public customers:any;
    public propertyObj: any;
    public genderOption: any;
    public selectedGenero: any[];
    public isRentOptions: any[];
    public addreesDetails: { street_1: string, street_2: string, sector_name: string, city: string, province: string, country: string } 
  


    ngOnInit() {
        this.propertyObj = JSON.parse(localStorage.getItem('property'))

        this._activatedRoute.params.subscribe(param => {

            let id = param['id'];
         
          
            if (id != undefined) {
                
                this._condominioService.getBuilding(id, this.token).subscribe(
                    response => {
                      
           
                        if (response.status == 'success') {
                           
                            this.buildingDetails = response.message
                            
                            this.units = (this.buildingDetails.units_ownerId.length) 

                            this.dateFormatted = dateTimeFormatter(this.buildingDetails.createdAt)
                         
                            this.propertyData(this.buildingDetails)
                            
                            this.customers = this.buildingDetails.units_ownerId
                  

                        }

                       
                    },
                    error => {

                        console.log(error)
                    }
                )
            }

          

           
        })

        this.genderOption = [
            { name: 'Male', code: 'm' },
            { name: 'Female', code: 'f' }
        ];

        this.parkingOptions = []

        for (let index = 1; index < 5; index++) {

            this.parkingOptions.push(index)

        }

        this.isRentOptions = [
            { name: 'Yes', code: true },
            { name: 'No', code: false }
        ]

        this.property_typeOptions = [
            {"name": "House", code:"house" }, 
            { "name": "Apartment", code:"apartment"}, 
            { "name": "Condo" , code:"condo" }, 
            { "name": "Townhouse" , code:"townhouse" }, 
            { "name": "Villa", code:"villa" },  
            { "name": "Penthouse" , code:"penthouse" }, 
          ]
            
         
      
        // Address Details - Card
        this.ownerObj.addressId = this.propertyObj._id
        this.addreesDetails.street_1 = this.propertyObj.street_1
        this.addreesDetails.street_2 = this.propertyObj.street_2
        this.addreesDetails.sector_name = this.propertyObj.sector_name
        this.addreesDetails.city = this.propertyObj.city
        this.addreesDetails.province = this.propertyObj.province
        this.addreesDetails.country = this.propertyObj.country

        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];



        
        
      
        
        this.stepperThird = true
   
    }

    
    btnSecondStepper() {

        if (this.ownerObj.ownerName != '' && this.ownerObj.lastname != '' && this.ownerObj.phone != '' && this.ownerObj.gender != '') {
            return false
        }
        return true
    }

    stepperThird: boolean;
    selectInputValues($event){

     

        switch ($event.target.name) {
            case 'isRent':

                this.ownerObj.isRenting = $event.target.value
            
                break;
                
            case 'parking':

                this.ownerObj.parkingsQty = $event.target.value
                
                break;
            case 'property_type':

                this.ownerObj.property_type = $event.target.value
                this.stepperThird = false
                break;
            case 'gender':

                this.ownerObj.gender = $event.target.value
               
                
                break;
        
            default:
                break;
        }

        console.log(this.ownerObj)
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    public visible: boolean = false;
 
    showDialog() {
        this.visible  = true;  
    }

    
    // Crear table de manera dinamica para el modal 
    setModalContent(modalKey:string){
     
        let template = {
            headers: {
                unit_detalis: {
                    title:'Unit Details',
                    thead:['Image','Unit Number', 'Owner', 'Email', 'Phone', 'Status', 'Actions'],
                    tdata: this.propertyObj
                    
                },
            }
        }
        
        return template.headers[modalKey]
    }



    getModalContent(){
        return this.setModalContent('unit_detalis')
    }


}

