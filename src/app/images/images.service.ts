import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataStoreService } from '../shared/data-store.service';
export interface ImagesProps {
  id: string;
  imageName: string;
  imageUrl: string;
  tags: string[];
  date: Date | string;
}
@Injectable({ providedIn: 'root' })
export class ImageService {
  images!: ImagesProps;
  editImage!: ImagesProps;
  viewImage!: ImagesProps;
  delteImage!: ImagesProps;
  viewImageObs = new Subject<ImagesProps | null>();
  editImageObs = new Subject<ImagesProps | null>();
  deleteImageObs = new Subject<ImagesProps | null>();

  constructor(
    private http: HttpClient,
    private dataStoreService: DataStoreService
  ) {}
  async getBase64(file: any) {
    const fileData = new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        return resolve(reader.result);
      };
      reader.onerror = function (error) {
        console.error('Error: ', error);
      };
    });
    return await fileData;
  }
  getImages() {
    this.dataStoreService.getImages().subscribe(
      (data) => {
        this.dataStoreService.setImageData(data);
        this.dataStoreService.imagesObs.next(data);
      },
      (error) => {
        this.dataStoreService.imagesObs.next([]);
        console.log(error, '🐞🐞🐞 Error');
      }
    );
  }
}
