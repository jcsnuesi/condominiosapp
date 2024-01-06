import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { UpdateCustomerComponent } from '../update-customer/update-customer.component';
import { DocumentationsComponent } from '../documentations/documentations.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CustomersComponent, children:[
			{ path: 'details', component: UpdateCustomerComponent },
			{ path: 'docs', component: DocumentationsComponent }
		]}
	])],
	exports: [RouterModule]
})
export class CustomersDemoRoutingModule { }
