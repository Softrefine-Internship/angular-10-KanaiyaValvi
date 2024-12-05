import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageService, ImagesProps } from '../images.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-image',
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.scss'],
})
export class ViewImageComponent implements OnInit, OnDestroy {
  image!: ImagesProps | null;
  subscriptions!: Subscription;
  isTagsOpen = false;
  tagFeatures = {
    tags: this.image?.tags.slice(0, 3),
    moreTag: this.image?.tags.slice(3, 1),
  };
  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.subscriptions = this.imageService.viewImageObs.subscribe(
      (img: any) => {
        this.image = img;
        this.tagFeatures = {
          tags: this.image?.tags.slice(0, 2),
          moreTag: this.image?.tags.slice(2, img.tags.length),
        };
      }
    );
  }
  onClose() {
    this.image = null;
    this.isTagsOpen = false;
    this.imageService.viewImageObs.next(null);
  }
  showTags() {
    this.isTagsOpen = true;
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscriptions.unsubscribe();
  }
}
