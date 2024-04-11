import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ActivatedRoute } from '@angular/router';
import { CondominioService } from '../../service/condominios.service';
import { UserService } from '../../service/user.service';
import { CookieService } from 'ngx-cookie-service';
import { property_details } from '../../service/property_details_type';
import { dateTimeFormatter } from '../../service/datetime.service';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [
        CondominioService,
        UserService]
})
export class DashboardComponent implements OnInit, OnDestroy {

   

    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;
    public buildingDetails: property_details;
    public units:number;
    private token:string;
    public dateFormatted:string;
    public currentIcon:string;
    public gbColor:string;

    
    constructor(
        private productService: ProductService, 
        public _condominioService: CondominioService,
        public _userService: UserService,
        public layoutService: LayoutService,
        private _activatedRoute:ActivatedRoute,
        private _cookieService: CookieService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });


        this.token = this._userService.getToken()
        this.currentIcon = 'pi-building'
        this.gbColor = 'blue-100'
    }


    @Output() propertyInfoEvent: EventEmitter<any> = new EventEmitter();
    
    propertyData(data) {
        // emit data to parent component
        this.propertyInfoEvent.emit(data);
    }
    

    onMouseOver(): void {
        this.currentIcon = 'pi-plus';
        this.gbColor = 'yellow-200'
    }
    onMouseOut(): void {

        this.currentIcon = 'pi-building'
        this.gbColor = 'blue-100'

    }

    
    ngOnInit() {

        
       

        this._activatedRoute.params.subscribe(param => {

            let id = param['id'];
          
            if (id != undefined) {
                
                this._condominioService.getBuilding(id, this.token).subscribe(
                    response => {
                      
           
                        if (response.status == 'success') {
                        
                            this.buildingDetails = response.message

                            this.units = (this.buildingDetails[0].units.length) 

                            this.dateFormatted = dateTimeFormatter(this.buildingDetails[0].createdAt)
                         
                            this.propertyData(this.buildingDetails[0])
                            
                          
                            

                            // this.addNewItem("saludos desde child")


                        }

                       
                    },
                    error => {

                        console.log(error)
                    }
                )
            }

           
        })


     
        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' }
        ];
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
}

