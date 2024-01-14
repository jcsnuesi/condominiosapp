import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-create-property',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.scss']
})
export class CreatePropertyComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {
      console.log("property")
  }

}
