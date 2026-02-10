// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: '',
  baseUrl: '',
  login: '/user/login',
  websocketUrl: 'ws://localhost:8080/ws',

  /*SOPARCO*/
  client: 'soparco',
  MSclientID: '66749a87-88c1-4572-a4c7-1b0797f84a85',
  MStenantID: '9188040d-6c67-4c5b-b112-36a304b66dad',
  MSredirectUri: 'http://soparco-elliance.geolane.fr/login',
  facebook_url: 'https://www.facebook.com/Soparco/',
  linkedin_url: 'https://fr.linkedin.com/company/soparco-sas',
  twitter_url: '',
  instagram_url: 'https://www.instagram.com/equipe_soparco/',
  youtube_url: 'https://www.youtube.com/watch?v=Q_rVD_pKRM4',
  logo: '/assets/logo/logo-soparco.png',

  /*Eurochef 
  client: 'eurochef',
  MSclientID: '66749a87-88c1-4572-a4c7-1b0797f84a85',
  MStenantID: '9188040d-6c67-4c5b-b112-36a304b66dad',
  MSredirectUri: 'https://devischef-v2.geolane.fr/login',
  facebook_url: 'https://www.facebook.com/eurochef/',
  linkedin_url: 'https://fr.linkedin.com/company/soparco-sas',
  twitter_url: 'https://twitter.com/eurochefpro',
  instagram_url: 'https://www.instagram.com/eurochef_reseau/',
  youtube_url: 'https://www.youtube.com/user/eurochefvideo',
  logo: '/assets/images/HEADER/Logo_client-eurochef.svg',
*/
  samlConfig: {
    entryPoint: 'https://sts.windows.net/a525bbbb-a427-466a-bb2f-98ff8340ab60/',
    issuer: 'https://sts.windows.net/a525bbbb-a427-466a-bb2f-98ff8340ab60/',
    callbackUrl: 'https://devischef-v2.geolane.fr/login',
    cert: `MIIC8DCCAdigAwIBAgIQM/Frg5Hx7Z5HLVocsVAn2TANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0yMzA0MDcxNDA0NDBaFw0yNjA0MDcxNDA0MzlaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQgU1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxnU6t7OEhZQe2A8J3j4GEq/jw915kPhEv6N8hxNz7yAy7G8uwWNdY7ARYoQnK15IIMgqDg1O0srFX7rtC4tvgWDS5pG9qd2sjqjHojGxptRgmPbK86SS0sUJSFvSI/HqyNl0w7mq8JIu/6nDQreiXmPcLX1hJ7nxjN4hlGwboGLEOUWHai0fxFLd2AWWzqb/2HNhnyBJF+txVwtwUmt3r4+0pq2kksYtFZlhX77krsO13RAd/ZHh5krA6bU9qY3gdLCsPHDS0LmuMpxOR5kgoPnvEXcJqpfnJNyg2JKPKeCGvboG4p2ayU1utaZK+POGydXgy4tzQzO+xZGtk80aNQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAL3H/2pEdxpAUWQxMI6iRa5/7KCnj/DgyvTvucMWq5yUqrFHYPqB/lN+T8Wqg7xwnrVHcbPSunuw3b2UHOW08ieXMEMAxFwNm30jSS4hVrf7hxvKxBYz5yPho+0KJcJ1tga9cefc90P7snBDAQ0PY0qYy5ZLykK/tFABCiV2sSK2jUqiBsgslWaUfmy/aUi0Cb+6AJdG3gr/zmkpXHQC44YJ02RKeXfKPRKX8l8IRGyGil9KTxRN8GpVIH4xLlj53Gcu5Dq46GXG21m+XoHNlT/coRja27k2KeLs32APsEdkfJOvAom/9sbjeU6NL6zgc3g/5ZD7sOjNzHMEkiYDl0`,
  },
};

/*
 * SAML file
 */

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI=.
