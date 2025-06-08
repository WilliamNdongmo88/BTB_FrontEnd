import { HttpInterceptorFn } from '@angular/common/http';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const isLoginRequest = req.url.includes('/api/connexion');
  console.log('isLoginRequest : ', isLoginRequest);

  // Ne pas ajouter d'en-tête Authorization pour la requête de connexion
  if (token && !isLoginRequest) {
    console.log('authTokenInterceptor token :', token);
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token.trim()}`,
        'Content-Type': 'application/json'
      }
    });
    return next(authReq);
  }

  return next(req);
};
