import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loaderSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  public loaderState = this.loaderSubject.asObservable();

  constructor() {}

  showLoader(): void {
    this.loaderSubject.next(true);
  }

  hideLoader(): void {
    this.loaderSubject.next(false);
  }
}
