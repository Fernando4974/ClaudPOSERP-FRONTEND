import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { connectToServer } from './app/web-socket/socket-client';


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
connectToServer();
