import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CustomersComponent } from './customers.component';
import { UpdateCustomerComponent } from '../update-customer/update-customer.component';
import { DocumentationsComponent } from '../documentations/documentations.component';
import { PropertiesComponent } from '../properties/properties.component';


@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CustomersComponent, children:[
			{ path: 'details', component: UpdateCustomerComponent },
			{ path: 'properties', component: PropertiesComponent },
			{ path: 'docs', component: DocumentationsComponent }
		]}
	])],
	exports: [RouterModule]
})
export class CustomersDemoRoutingModule { }
