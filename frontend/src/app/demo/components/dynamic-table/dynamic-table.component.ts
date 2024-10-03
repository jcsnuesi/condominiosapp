import { Component, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AvatarModule } from 'primeng/avatar';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ConfirmDialogModule,
    HasPermissionsDirective,
    CardModule
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent implements OnInit {


  @Input() inputData!: any;
  public nodata: boolean;

  constructor( private confirmationService: ConfirmationService) {
    this.nodata = false;
   }

ngOnInit() {

 
  console.log('Data recieved', this.inputData);
}




}
 