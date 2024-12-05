import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImageService, ImagesProps } from '../images.service';
import { Subscription } from 'rxjs';
import { DataStoreService } from 'src/app/shared/data-store.service';
import { FileHandle } from 'src/app/shared/dragDrop.directive';
@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss'],
})
export class EditImageComponent implements OnInit, OnDestroy {
  image!: ImagesProps | null;
  subscriptions!: Subscription;
  tagValue: string = '';
  imageName: string = '';
  tags: string[] = [];
  files: FileHandle[] = [];
  isLoading: boolean = false;
  date!: string | Date;
  tagError: boolean = false;
  imageChanged: boolean = false;

  constructor(
    private imageService: ImageService,
    private dataStoreService: DataStoreService
  ) {}

  ngOnInit(): void {
    this.subscriptions = this.imageService.editImageObs.subscribe(
      (img: ImagesProps | null) => {
        this.image = img;
        this.date = this.image?.date || '';
        this.imageName = this.image?.imageName || '';
        this.tags = this.image?.tags.slice() || [];
      }
    );
  }
  onClose() {
    this.image = null;
    this.imageName = '';
    this.tagValue = '';
    this.date = '';
    this.tags = [];
    this.files = [];
    this.tagError = false;
    this.imageChanged = false;
    this.imageService.editImageObs.next(null);
  }
  addTag() {
    if (this.tagValue !== '') {
      if (this.tags.includes(this.tagValue.toLowerCase())) {
        return;
      }
      this.tags.push(this.tagValue.trim().toLowerCase());
    }
    this.tagError = this.tags.length === 0;
    this.tagValue = '';
  }
  removeTag(index: number) {
    this.tags.splice(index, 1);
    this.tagError = this.tags.length === 0;
  }

  onImageUpdate() {
    if (this.tagError) return;
    const compareTags =
      JSON.stringify(this.tags) === JSON.stringify(this.image?.tags);
    if (
      !this.imageChanged &&
      compareTags &&
      this.image?.imageName === this.imageName
    ) {
      return;
    }
    const name = this.imageName === '' ? this.image?.imageName : this.imageName;

    if (!this.image) return;
    const imagesData = {
      ...this.image,
      date: new Date(this.image.date),
      imageName: name,
      tags: this.tags || [],
    };

    this.isLoading = true;
    this.dataStoreService.updateImage(imagesData).subscribe((data) => {
      this.imageService.getImages();
      this.isLoading = false;
      this.onClose();
      console.log(data);
      return data;
    });
  }

  // upload file change
  async onFileChange(file: any) {
    const FilePath = await this.toBase64(file.target.files[0]);
    this.files = [{ file: file.target.files[0], url: FilePath }];
    this.imageChanged = true;
  }
  filesDropped(files: FileHandle[]): void {
    this.files = files;
    if (this.image) {
      this.image.imageUrl = this.files[0].url;
    }
  }
  private toBase64(file: any) {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        return resolve(reader.result);
      };
      reader.onerror = function (error) {};
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
