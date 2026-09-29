import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { RegisterDemoRoutingModule } from './register-routing.module';
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
import { FileUploadModule } from 'primeng/fileupload';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';

 

@NgModule({
	imports: [
		CommonModule,
		MessageModule,
		CheckboxModule,
		FormsModule,
		RegisterDemoRoutingModule,
		AutoCompleteModule,
		DatePickerModule,
		AutoCompleteModule,
		SelectModule,
		InputMaskModule,
		InputNumberModule,
		CascadeSelectModule,
		MultiSelectModule,
		TextareaModule,
		FileUploadModule,
		InputTextModule,
		DividerModule
	],
	declarations: [RegisterComponent]
})
export class RegisterDemoModule { }
