import { Component, OnInit } from '@angular/core';
import { DataStoreService } from './shared/data-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isLoading = false;
  constructor(private dataStoreService: DataStoreService) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.dataStoreService.getImages().subscribe(
      (data) => {
        this.dataStoreService.setImageData(data);
        this.dataStoreService.imagesObs.next(data);
        this.isLoading = false;
      },
      (error) => {
        this.dataStoreService.imagesObs.next([]);
        console.error(error, '🐞🐞🐞 Error');
        this.isLoading = false;
      }
    );
  }
}
