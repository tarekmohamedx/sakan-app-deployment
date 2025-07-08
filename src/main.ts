/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
// import { provideNgCharts } from 'ng2-charts';

// ✅ Chart.js imports
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PieController,
  ArcElement
} from 'chart.js';

// ✅ Register required chart types
Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PieController,
  ArcElement
);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-right-center',
      toastClass: 'ngx-toastr custom-toastr',
      titleClass: 'custom-toastr-title',
      messageClass: 'custom-toastr-message',
      closeButton: true,
      progressBar: true,
      enableHtml: true,
      timeOut: 3000
    })
  ]
}).catch((err) => console.error(err));

