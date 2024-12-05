import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileHandle } from '../shared/dragDrop.directive';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ImageService, ImagesProps } from '../images/images.service';
import { HttpClient } from '@angular/common/http';
import { DataStoreService } from '../shared/data-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  subscriptions!: Subscription;
  imageUploaderIsOpen = false;
  sortValue = 'name';
  files: FileHandle[] = [];
  imageFormGroup!: FormGroup;
  images!: ImagesProps[];
  tagValue: string = '';
  searchText: string = '';
  tags: string[] = [];
  searchTag: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private imageService: ImageService,
    private dataStoreService: DataStoreService
  ) {}

  ngOnInit(): void {
    this.subscriptions = this.dataStoreService.imagesObs.subscribe(
      (img) => (this.images = img)
    );
    this.images = this.dataStoreService.getImagesData();
    this.imageFormGroup = new FormGroup({
      imageName: new FormControl(null, Validators.required),
      imageFile: new FormControl(null, Validators.required),
    });
  }

  addTag() {
    if (this.tagValue !== '') {
      if (this.tags.includes(this.tagValue)) {
        return;
      }
      this.tags.push(this.tagValue.trim().toLowerCase());
    }
    this.tagValue = '';
  }
  removeTag(index: number) {
    this.tags.splice(index, 1);
  }

  open() {
    this.imageUploaderIsOpen = true;
  }

  onClose() {
    this.files = [];
    this.imageFormGroup.reset();
    this.tagValue = '';
    this.tags = [];
    this.imageUploaderIsOpen = false;
  }
  filesDropped(files: FileHandle[]): void {
    this.files = files;
  }
  async onFileChange(file: any) {
    const FilePath = await this.toBase64(file.target.files[0]);
    this.files = [{ file: file.target.files[0], url: FilePath }];
  }

  removeImage() {
    this.files = [];
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

  onSubmit(): void {
    const { imageName } = this.imageFormGroup.value;

    if (imageName === '' || this.tags.length === 0 || !this.files[0]) {
      return;
    }

    const payload = {
      imageName,
      tags: this.tags,
      imageUrl: this.files[0].url,
      date: new Date(),
    };
    this.isLoading = true;
    this.http
      .post<any>(
        'https://kanha-image-gallery-angular-default-rtdb.firebaseio.com/images.json',
        payload
      )
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.imageService.getImages();
          this.images = this.dataStoreService.getImagesData();
          this.onClose();
          return response;
        },
        (error) => {
          this.isLoading = false;
          console.error(error);
        }
      );
  }

  onOpenUpload() {
    this.open();
  }
  onShort() {
    if (this.sortValue === 'date') {
      this.images = this.images.slice().sort((a: any, b: any) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    } else {
      this.images = this.images.slice().sort((a: any, b: any) => {
        return a.imageName.localeCompare(b.imageName);
      });
    }
    this.dataStoreService.imagesObs.next(this.images);
  }
  onReset() {
    this.images = this.dataStoreService.getImagesData();
    this.searchText = '';
    this.searchTag = '';
    this.dataStoreService.imagesObs.next(this.images);
  }
  onSearch() {
    console.log(this.searchText === '');
    const images = this.dataStoreService.getImagesData();
    if (this.searchText === '') {
      this.dataStoreService.imagesObs.next(images);
    } else {
      this.searchTag = this.searchText;
      this.images = images.filter((item) =>
        item.tags.includes(this.searchText.toLowerCase())
      );
      this.dataStoreService.imagesObs.next(this.images);
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
