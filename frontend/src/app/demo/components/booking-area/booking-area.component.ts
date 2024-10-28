
import { Component, AfterViewInit, EventEmitter, OnInit, Output, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';


@Component({
  selector: 'app-booking-area',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule
    
  ],
  
  templateUrl: './booking-area.component.html',
  styleUrl: './booking-area.component.css'
})
export class BookingAreaComponent implements OnInit {

  calendarOptions: CalendarOptions;
  

  ngOnInit(): void {

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      dateClick: (arg) => this.handleDateClick(arg),
      events: [
        { title: 'event 1', date: '2019-04-01' },
        { title: 'event 2', date: '2019-04-02' }
      ]
    };
      
  }

  handleDateClick(arg) {
    alert('date click! ' + arg.dateStr)
  }

  ngAfterViewInit() {
    console.log('Calendario renderizado*********ngAfterViewInit*******');
    this.renderCalendar();
  }

  renderCalendar() {
    const calendarElement = document.querySelector('full-calendar');
    if (calendarElement) {
      // Forzar el renderizado del calendario
      (calendarElement as any).getApi().render();
      console.log('Calendario renderizado****************');
    }
  }
  
}
