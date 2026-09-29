import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FloatLabelDemoComponent } from './floatlabeldemo.component';
import { FloatlabelDemoRoutingModule } from './floatlabeldemo-routing.module';
import { AutoCompleteModule } from "primeng/autocomplete";
import { DatePickerModule } from "primeng/calendar";
import { AutoCompleteModule } from "primeng/chips";
import { SelectModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { TextareaModule } from "primeng/inputtextarea";
import { InputTextModule } from "primeng/inputtext";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FloatlabelDemoRoutingModule,
		AutoCompleteModule,
		DatePickerModule,
		AutoCompleteModule,
		SelectModule,
		InputMaskModule,
		InputNumberModule,
		CascadeSelectModule,
		MultiSelectModule,
		TextareaModule,
		InputTextModule
	],
	declarations: [FloatLabelDemoComponent]
})
export class FloatlabelDemoModule { }
