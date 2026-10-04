import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomersComponent } from './customers.component';
import { CustomersDemoRoutingModule } from './customers-routing.module';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { UpdateCustomerComponent } from '../update-customer/update-customer.component';
import { TabsModule } from 'primeng/tabs';

@NgModule({
	imports: [
		CommonModule,
		DialogModule,
		TabsModule,
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
		SelectModule,
		RatingModule,
		ButtonModule
	],
	declarations: [CustomersComponent]

})
export class CustomersDemoModule { }
