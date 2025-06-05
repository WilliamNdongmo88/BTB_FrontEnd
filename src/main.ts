import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig,)
  .catch((err) => console.error(err));

// import { bootstrapApplication } from '@angular/platform-browser';
// import { provideHttpClient } from '@angular/common/http';
// import { importProvidersFrom } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
// import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

// import { AppComponent } from './app/app.component';
// import { routes } from './app/app.routes';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideHttpClient(),
//     provideRouter(routes),
//     importProvidersFrom(SocialLoginModule),
//     {
//       provide: 'SocialAuthServiceConfig',
//       useValue: {
//         autoLogin: false,
//         providers: [
//           {
//             id: GoogleLoginProvider.PROVIDER_ID,
//             provider: new GoogleLoginProvider('springboot-oauth2-457002')
//           }
//         ]
//       } as SocialAuthServiceConfig
//     }
//   ]
// });
