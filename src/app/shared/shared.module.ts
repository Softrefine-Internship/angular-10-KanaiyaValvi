import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalComponent } from './modal/modal.component';
import { DragDirective } from './dragDrop.directive';
import { ClickStopPropagation } from './clickstop-propagation.directive';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    ModalComponent,
    DragDirective,
    ClickStopPropagation,
    LoaderComponent,
  ],
  imports: [CommonModule],
  exports: [
    ModalComponent,
    DragDirective,
    ClickStopPropagation,
    LoaderComponent,
  ],
})
export class SharedModule {}
