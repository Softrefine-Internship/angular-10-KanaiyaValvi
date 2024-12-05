import { HttpClient } from '@angular/common/http';
import { ImagesProps } from '../images/images.service';
import { map, Subject, tap } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataStoreService {
  imagesObs = new Subject<ImagesProps[] | []>();
  imagesData: ImagesProps[] = [];
  constructor(private http: HttpClient) {}
  getImages() {
    return this.http
      .get<ImagesProps>(
        'https://kanha-image-gallery-angular-default-rtdb.firebaseio.com/images.json'
      )
      .pipe(
        map((item: any) => {
          const images: any = [];
          Object.keys(item).forEach((key: any) => {
            images.push({ id: key, ...item[key] });
          });

          return images;
        })
      );
  }
  getImagesData() {
    return this.imagesData.slice();
  }
  setImageData(imageData: ImagesProps[]) {
    this.imagesData = imageData;
  }
  deleteImages(id: string) {
    return this.http.delete(
      `https://kanha-image-gallery-angular-default-rtdb.firebaseio.com/images/${id}.json`
    );
  }

  updateImage(imagesData: ImagesProps | any) {
    const { imageName, imageUrl, tags, id, date } = imagesData;
    const payload = { imageName, imageUrl, tags, date };
    return this.http.put(
      `https://kanha-image-gallery-angular-default-rtdb.firebaseio.com/images/${id}.json`,
      payload
    );
  }
}
