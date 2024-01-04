import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { UpdateCustomerComponent } from '../update-customer/update-customer.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CustomersComponent, children:[
			{ path: 'details', component: UpdateCustomerComponent }
		]}
	])],
	exports: [RouterModule]
})
export class CustomersDemoRoutingModule { }
