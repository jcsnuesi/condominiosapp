import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreserveOrderPipe } from './perservedOrder';
import { KeysValuesPipe } from './perservedOrder';

@NgModule({
  declarations: [PreserveOrderPipe, KeysValuesPipe],
  imports: [
    CommonModule
  ],
  exports: [PreserveOrderPipe, KeysValuesPipe]
})
export class PipesModuleModule { }
