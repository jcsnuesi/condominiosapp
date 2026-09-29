import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvalidStateDemoComponent } from './invalidstatedemo.component';
import { InvalidStateDemoRoutingModule } from './invalidstatedemo-routing.module';
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
import { PasswordModule } from "primeng/password";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		InvalidStateDemoRoutingModule,
		AutoCompleteModule,
		DatePickerModule,
		AutoCompleteModule,
		SelectModule,
		InputMaskModule,
		InputNumberModule,
		CascadeSelectModule,
		MultiSelectModule,
		PasswordModule,
		TextareaModule,
		InputTextModule
	],
	declarations: [InvalidStateDemoComponent]
})
export class InvalidStateDemoModule { }
