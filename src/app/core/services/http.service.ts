import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Http } from '@capacitor-community/http';
import { SSLCertificateChecker } from 'capacitor-ssl-pinning';
import { BehaviorSubject, from, Observable, throwError } from 'rxjs';
import { switchMap, catchError, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class HttpService {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private router: Router,
    private config: ConfigService,
    private notify: NotificationService
  ) {}

  // Detect mobile app runtime
  private isNative() {
    return Capacitor.isNativePlatform();
  }

  // Public HTTP wrappers
  get(url: string, options: any = {}) {
    return this.makeRequest("GET", url, null, options);
  }

  post(url: string, body: any, options: any = {}) {
    return this.makeRequest("POST", url, body, options);
  }

  put(url: string, body: any, options: any = {}) {
    return this.makeRequest("PUT", url, body, options);
  }

  delete(url: string, options: any = {}) {
    return this.makeRequest("DELETE", url, null, options);
  }

  // ========== MAIN REQUEST HANDLER ==========
  private makeRequest(method: string, url: string, body?: any, options: any = {}): Observable<any> {
    return from(Preferences.get({ key: 'userData' })).pipe(
      switchMap(pref => {
        const userData = pref.value ? JSON.parse(pref.value) : null;
        const token = userData?.jwtoken;

        // Build headers - do NOT set Content-Type for FormData (let Angular handle it)
        let headerObj: any = {};
        if (!(body instanceof FormData)) {
          headerObj['Content-Type'] = 'application/json';
        }
        headerObj = { ...headerObj, ...(options.headers || {}) };
        if (token) {
          headerObj['Authorization'] = `Bearer ${token}`;
        }
        const headers = new HttpHeaders(headerObj);

        // ----------- SSL PINNING (Mobile only) -----------
        // (Uncomment this without miss to enable SSL Pinning for Mobile)
        // if (this.isNative()) {
        //   return from(this.validateCertificate()).pipe(
        //     switchMap(() => {
        //       console.log("🔐 SSL Pinning Passed — making API request:", {
        //         method,
        //         url,
        //         headers,
        //         body,
        //         params: options.params
        //       });

        //       return from(
        //         Http.request({
        //           method,
        //           url,
        //           headers,
        //           data: body,
        //           params: options.params || {}
        //         })
        //           .then(res => {
        //             console.log("✅ Native HTTP Success:", res);
        //             return res.data;
        //           })
        //           .catch(err => {
        //             console.error("❌ Native HTTP Error BEFORE handler:", err);
        //             throw err;
        //           })
        //       ).pipe(
        //         catchError(err => {
        //           console.error("⚠️ Error passed into handler:", err);
        //           return this.handleError(err, method, url, body, options);
        //         })
        //       );
        //     }),
        //     catchError(err => {
        //       console.error("🚫 SSL Pinning Failed — blocking request:", err);
        //       return throwError(() => err);
        //     })
        //   );
        // }

        // ----------- Browser request --------------
        return this.http.request(method, url, {
          headers: headers,  // Already HttpHeaders object
          body,
          params: options.params,
          responseType: options.responseType || 'json',  // Support blob, arraybuffer, text, etc.
          observe: options.observe || 'body',  // Support 'response' for full HttpResponse
          withCredentials: options.withCredentials || false
        }).pipe(
          catchError(err => this.handleError(err, method, url, body, options))
        );
      })
    );
  }

  // ========== SSL PINNING VALIDATION ==========
  private async validateCertificate(): Promise<boolean> {
    const host = this.config.sslHost;
    const pins = [this.config.primaryPin, this.config.fallbackPin].filter(x => !!x);
    console.log('Host', this.config.sslHost);
    console.log('pins', this.config.sslHost);
    console.log('Host old', host);
    console.log('pins old', pins);

    if (!host || pins.length === 0) return true;

    for (const pin of pins) {
      try {
        await SSLCertificateChecker.checkCertificate({
          url: host,
          fingerprint: pin,
        });
        console.log('SSL Pinning Passed with pin:', pin);
        return true; 
      } catch (err) {
        console.error('SSL Pinning Failed', err);
        throw err; 
      }
    }

    console.error('SSL Pinning Failed: all fingerprints mismatch');
    throw new Error('SSL Pinning Failed');
  }


  // ========== ERROR HANDLING + REFRESH TOKEN ==========
  private handleError(error: any, method: string, url: string, body: any, options: any) {
    if (error?.status === 401) {
      return this.handle401().pipe(
        switchMap(() => this.makeRequest(method, url, body, options))
      );
    }
    return throwError(() => error);
  }

  private handle401(): Observable<string> {
    return from(Preferences.get({ key: 'userData' })).pipe(
      switchMap(pref => {
        const userData = pref.value ? JSON.parse(pref.value) : null;

        if (!userData?.refreshToken) {
          this.forceLogout();
          return throwError(() => new Error("No refresh token"));
        }

        if (!this.isRefreshing) {
          this.isRefreshing = true;
          this.refreshTokenSubject.next(null);

          return this.refreshToken(userData?.jwtoken, userData.refreshToken, userData.username, userData.empId).pipe(
            switchMap((res: any) => {
              this.isRefreshing = false;

              const newToken = res[0].jwToken;
              const newRefresh = res[0].refreshToken;

              userData.jwtoken = newToken;
              userData.refreshToken = newRefresh;

              Preferences.set({
                key: 'userData',
                value: JSON.stringify(userData)
              });

              this.refreshTokenSubject.next(newToken);
              return [newToken];
            }),
            catchError(err => {
              this.isRefreshing = false;
              this.forceLogout();
              return throwError(() => err);
            })
          );
        }

        return this.refreshTokenSubject.pipe(
          filter(token => token !== null),
          take(1)
        );
      })
    );
  }

  private refreshToken(jwtoken: string, refresh: string, username: string, loginId: number) {
    const url = `${this.config.apiUrl}/api/Login/CheckRefreshToken`;

    const body = {
      accessToken: jwtoken,
      refreshToken: refresh,
      username,
      loginId,
      refreshExpiry: "",
      type: "CHECK"
    };

    return this.post(url, body);
  }

  private async forceLogout() {
    const { value: userDataValue } = await Preferences.get({ key: 'userData' });
    if (userDataValue) {
      const userData = JSON.parse(userDataValue);
      userData.loggedIn = false;
      await Preferences.set({ key: 'userData', value: JSON.stringify(userData) });
    }    
    this.notify.showNotification("Session Out", "error", "center", "bottom");
    this.router.navigate(['/login']);
  }
}
