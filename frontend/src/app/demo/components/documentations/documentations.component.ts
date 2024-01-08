import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-documentations',
  templateUrl: './documentations.component.html',
  styleUrls: ['./documentations.component.scss'],
  standalone:true,
  imports: [TableModule, FileUploadModule],
  providers: [UserService]
})
export class DocumentationsComponent {
  public docs:any;

  constructor(private _userService: UserService){}


  onBasicUploadAuto(event){

  }

}
