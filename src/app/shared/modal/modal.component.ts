import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  onClose(e: Event): void {
    e.preventDefault();
    e.stopPropagation();
    this.close.emit();
  }
}
