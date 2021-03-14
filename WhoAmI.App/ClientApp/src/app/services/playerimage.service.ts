import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerImageService {
  private imagePath = '/assets/img/playericons/';
  private imageCount = 73;

  constructor() {
  }

  public getRandomImageNumber(): number {
    return Math.floor(Math.random() * this.imageCount) + 1;
  }

  public getRandomImage(): string {
    return this.getImage(this.getRandomImageNumber());
  }

  public getDefaultImage(): string {
    return this.getImage(0);
  }

  public getImage(num: number): string {
    return this.imagePath + this.zeroPad(num, 2) + '.png';
  }

  private zeroPad(num, places) {
    const zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
  }
}
