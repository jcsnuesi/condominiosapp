
import { Component, AfterViewInit, EventEmitter, OnInit, Output, Input, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';

type AreaFormat = {
  memberId: string;
  areaId: string;
  areaName: string;
  chosenDate: Date;
  chosenTime: string;  

}

@Component({
  selector: 'app-booking-area',
  standalone: true,
  imports: [
    HasPermissionsDirective,
    CommonModule,
    CalendarModule,
    FormsModule, 
    FieldsetModule,
    FloatLabelModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    TagModule 
  ],
  templateUrl: './booking-area.component.html',
  styleUrl: './booking-area.component.css'
})
export class BookingAreaComponent implements OnInit {

  public dates: Date[] = [];
  public selectedArea: string;
  public areaOptions: any[] = [];
  public bookingInfo:any[];

  
  
 constructor() { 

   this.bookingInfo =[ {
    bookedBy: 'John Doe',
    unit: 'Apto 101',
    areaName: 'Piscina',
    chosenDate: new Date(),
    chosenTime: '10:00 AM',
    chosenEndTime: '11:00 AM',
    status: 'Scheduled'
   }]
 }
 
 ngOnInit(): void {
    this.areasAvailable();
 }

  ngAfterViewInit() {

    // this.areaCalentarRef.nativeElement.style.top = '0px';
    // Accede a las propiedades del componente p-calendar después de que la vista se haya inicializado

 
  
    
  }
  
  areasAvailable(){

   
    
    let areasJson = JSON.parse(localStorage.getItem('property')) 

    if (areasJson.socialAreas
      && areasJson.socialAreas.length > 0) {

      areasJson.socialAreas.forEach((area, index) => {
        this.areaOptions.push({ label: area, name: area });
      });
      }


    }
  

  
  
}
