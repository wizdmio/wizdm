// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  appname: 'wizdm',

  firebase: {
    apiKey: "AIzaSyBvMhg2V5BQUNba3XRfYu8-todWTFaKeFQ",
    authDomain: "wizdm-d3f02.firebaseapp.com",
    databaseURL: "https://wizdm-d3f02.firebaseio.com",
    projectId: "wizdm-d3f02",
    storageBucket: "wizdm-d3f02.appspot.com",
    messagingSenderId: "165173761855"
  }
};

