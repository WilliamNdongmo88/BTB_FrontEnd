import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const isLoginRequest = req.url.includes('/api/connexion');
  console.log('isLoginRequest : ', isLoginRequest);
  console.log('[Interceptor] Token actuel dans localStorage <<-- Important:', token);

  // N'ajoute pas d'en-tête Authorization pour la requête de connexion
  if (token && !isLoginRequest) {
    console.log('authTokenInterceptor token :', token);
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Intercepteur appliqué à :', authReq.url);
    console.log('[Interceptor] Token ajouté:', token);
    return next(authReq);
  }

  return next(req);
};




