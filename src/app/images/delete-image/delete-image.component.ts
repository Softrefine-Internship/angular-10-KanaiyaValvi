import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageService, ImagesProps } from '../images.service';
import { DataStoreService } from 'src/app/shared/data-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-image',
  templateUrl: './delete-image.component.html',
  styleUrls: ['./delete-image.component.scss'],
})
export class DeleteImageComponent implements OnInit, OnDestroy {
  image!: ImagesProps | null;
  subscriptions!: Subscription;
  isLoading: boolean = false;
  constructor(
    private imageService: ImageService,
    private dataStoreService: DataStoreService
  ) {}

  ngOnInit(): void {
    this.subscriptions = this.imageService.deleteImageObs.subscribe(
      (img: any) => {
        this.image = img;
      }
    );
  }
  onClose() {
    this.image = null;
    this.imageService.deleteImageObs.next(null);
  }
  onDelete(id: string) {
    this.isLoading = true;
    this.dataStoreService.deleteImages(id).subscribe((res) => {
      this.imageService.getImages();
      this.isLoading = false;
      this.onClose();
      return res;
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
