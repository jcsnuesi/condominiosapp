import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: DashboardComponent},
        { path: 'home', component: DashboardComponent },
        { path: 'home/:id', component: DashboardComponent }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
