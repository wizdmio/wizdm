
/* Import local configuration objects from ./config folder. Make sure tsconfig.json contains the following options:
{
  "compilerOptions": {
    "resolveJsonModule": true,
    "esModuleInterop": true  
  }
}
*/
import firebase from "./config/firebase.json";
import doorbell from "./config/doorbell.json";

// Environment object common to all build configurations
export const common = {
  
  appname: 'wizdm',

  firebase/*: { 
    apiKey: "Your api key",
    authDomain: "domain.firebaseapp.com",
    databaseURL: "https://yourapp.firebaseio.com",
    projectId: "Your project id",
    storageBucket: "yourapp.appspot.com",
    messagingSenderId: "Your sender id"
  }// to get the actual values go: https://console.firebase.google.com */,

  doorbell/*: {
    id: "Your app id",
    key: "Your app secret key"
  }// to get the actual values go: https://doorbell.io */
};