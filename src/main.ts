import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { register as registerSwiperElementes } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';


registerSwiperElementes();

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
