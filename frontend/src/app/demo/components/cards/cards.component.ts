import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../service/user.service';
import { global } from '../../service/global.service';
import { MessageService } from 'primeng/api';
import { CondominioService } from '../../service/condominios.service';
import { DialogModule } from 'primeng/dialog';
import { TabMenuModule } from 'primeng/tabmenu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { dateTimeFormatter } from '../../service/datetime.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule,
    TabMenuModule,
    DialogModule,
    ButtonModule,
    FormsModule
    
  ],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {

}
