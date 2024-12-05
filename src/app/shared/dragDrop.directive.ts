import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageService } from '../images/images.service';

export interface FileHandle {
  file: File;
  url: any;
}

@Directive({
  selector: '[appDrag]',
})
export class DragDirective {
  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();

  @HostBinding('style.background') private background = 'rgba(220, 38, 38,.09)';

  constructor(
    private sanitizer: DomSanitizer,
    private imageService: ImageService
  ) {}

  @HostListener('dragover', ['$event']) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'rgba(220, 38, 38,.2)';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'rgba(220, 38, 38,.09)';
  }

  @HostListener('drop', ['$event']) public async onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = 'rgba(220, 38, 38,.09)';

    let files: FileHandle[] = [];
    if (evt?.dataTransfer?.files.length) {
      for (let i = 0; i < evt?.dataTransfer?.files.length; i++) {
        const file = evt?.dataTransfer?.files[i];
        if (file.type.startsWith('image/')) {
          const url = await this.imageService.getBase64(file);
          files.push({ file, url });
        } else {
          console.warn(`File type not allowed: ${file.type}`);
        }
      }
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
