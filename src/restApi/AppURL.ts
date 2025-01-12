class AppURL {
  static swdlBaseURL: string = 'http://182.160.125.3:93/api/';

  static sslURL: string = 'http://182.160.125.3:91/api/';
  static solURL: string = 'http://182.160.125.2:91/api/';
  static scoURL: string = 'http://182.160.113.106:91/api/';
  static spuURL: string = 'http://182.160.105.210:91/api/';
  static salURL: string = 'http://182.160.113.78:91/api/';
  static cnsURL: string = 'http://182.160.117.90:91/api/';

  // Authentication APIs
  // static userLogin: string = `${this.sslURL}androidapps/PostLoginApk`;

  static userLogin(companyBaseURL: string): string {
    return `${companyBaseURL}androidapps/PostLoginApk`;
  }
  static getMenusApi(companyBaseURL: string, remarks: string): string {
    console.log(`${companyBaseURL}androidapps/GetMenuInfoApk?token=${remarks}`);

    return `${companyBaseURL}androidapps/GetMenuInfoApk?token=${remarks}`;
  }
  static getUserInfoApi(companyBaseURL: string, remarks: string): string {
    return `${companyBaseURL}androidapps/GetMyProfileInformationApk?token=${remarks}`;
  }

  static getReverseGeocode(geoLati: string, geoLongi: string): string {
    return `https://api-bdc.net/data/reverse-geocode-client?latitude=${geoLati}&longitude=${geoLongi}&localityLanguage=en`;
  }
  static postPunch(payrollBaseURL: string): string {
    return `${payrollBaseURL}androidapps/postpunchentryApk`;
  }
}

export default AppURL;
