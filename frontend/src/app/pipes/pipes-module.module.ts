import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreserveOrderPipe } from './perservedOrder';


@NgModule({
  declarations: [PreserveOrderPipe],
  imports: [
    CommonModule
  ],
  exports: [PreserveOrderPipe]
})
export class PipesModuleModule { }