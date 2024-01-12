import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomersComponent } from './customers.component';
import { CustomersDemoRoutingModule } from './customers-routing.module';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { UpdateCustomerComponent } from '../update-customer/update-customer.component';
import { TabMenuModule } from 'primeng/tabmenu';

@NgModule({
	imports: [
		CommonModule,
		DialogModule,
		TabMenuModule,		
		TagModule, 
		MultiSelectModule,
		FormsModule,
		TableModule,
		CustomersDemoRoutingModule,
		UpdateCustomerComponent,
		DataViewModule,
		PickListModule,
		OrderListModule,
		InputTextModule,
		DropdownModule,
		RatingModule,
		ButtonModule
	],
	declarations: [CustomersComponent]
	
})
export class CustomersDemoModule { }
