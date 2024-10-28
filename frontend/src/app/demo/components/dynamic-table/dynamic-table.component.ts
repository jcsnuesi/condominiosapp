import { Component, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AvatarModule } from 'primeng/avatar';
import { HasPermissionsDirective } from 'src/app/has-permissions.directive';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Router } from '@angular/router';
import { FamilyMemberDetailsComponent } from '../family-member-details/family-member-details.component';


@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    FamilyMemberDetailsComponent,
    PdfViewerModule,
    TableModule,
    CommonModule,
    ConfirmDialogModule,
    HasPermissionsDirective,
    CardModule,
    DialogModule,
    ProgressSpinnerModule
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.css'
})
export class DynamicTableComponent implements OnInit {


  @Input() inputData!: any;
  public nodata: boolean;
  public bodyTableInfo: any;
  public dynamicHeaders: any; 
  public _stringFormating: any;
  public visible_dynamic: any;
  public visible_spinner: any;
  public header_modal_aux: any;
  public pdfSrc: any;
  // public familyMember: any;
  public modalAuxInfo: any;



  constructor( private confirmationService: ConfirmationService) {
    this.nodata = false;
    
   
   }

public tblInfo: any;
ngOnInit() {

 
  console.log('Data recieved', this.inputData);
}




}
 