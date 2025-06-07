import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const isLoginRequest = req.url.includes('/api/connexion');
  console.log('[Interceptor] Token actuel dans localStorage <<-- Important:', token);

  // Ne pas ajouter d'en-tête Authorization pour la requête de connexion
  if (token && !isLoginRequest) {
    console.log('authTokenInterceptor token :', token);
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Intercepteur appliqué à :', authReq.url);
    console.log('[Interceptor] Token ajouté:', token);
    return next(authReq);
  }

  return next(req);
};


// import { HttpInterceptorFn } from '@angular/common/http';
// import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export const authInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<any>,
//   next: HttpHandlerFn
// ): Observable<HttpEvent<any>> => {
//   const token = localStorage.getItem('jwt');
//   console.log('[Interceptor] Token actuel dans localStorage <<-- Important:', token); // <<-- Important

//   if (token) {
//     const cloned = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });
//     console.log('✅ Intercepteur appliqué à :', cloned.url);
//     console.log('[Interceptor] Token ajouté:', token);
//     return next(cloned);
//   }

//   console.warn('[Interceptor] Aucun token trouvé dans le localStorage');
//   return next(req);
// };



