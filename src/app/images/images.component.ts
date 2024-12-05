import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageService, ImagesProps } from './images.service';
import { DataStoreService } from '../shared/data-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss'],
})
export class ImagesComponent implements OnInit, OnDestroy {
  images!: ImagesProps[];
  subscriptions!: Subscription;

  constructor(
    private imageService: ImageService,
    private dataStoreService: DataStoreService
  ) {}

  ngOnInit(): void {
    this.subscriptions = this.dataStoreService.imagesObs.subscribe((data) => {
      this.images = data;
    });
    this.images = this.dataStoreService.getImagesData();
  }
  onEdit(img: ImagesProps) {
    const image = { ...img };
    console.log(image);
    this.imageService.editImageObs.next(image);
  }
  onImageView(img: ImagesProps) {
    this.imageService.viewImageObs.next(img);
  }
  onDeleteImage(img: ImagesProps) {
    this.imageService.deleteImageObs.next(img);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
