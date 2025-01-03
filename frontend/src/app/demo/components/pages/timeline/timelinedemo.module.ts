import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineDemoRoutingModule } from './timelinedemo-routing.module';
import { TimelineDemoComponent } from './timelinedemo.component';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        TimelineModule,
        ButtonModule,
        CardModule,
        TimelineDemoRoutingModule,
        FieldsetModule,
        CalendarModule,
        FormsModule
    ],
    declarations: [TimelineDemoComponent]
})
export class TimelineDemoModule { }
