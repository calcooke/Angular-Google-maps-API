
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  token = null;

  constructor(private afMessaging: AngularFireMessaging) { }

  // Steps for push notifications:

  // 1: Ask the user for a token,
  // 2: Ask for permission upfront

  // We combine these by writing a function to request permission, in which
  // we return an angularfiremessaging request token

  requestPermission() {

    //Ask for permission, if the user gives it it returns a token
    return this.afMessaging.requestToken.pipe(
      tap(token => {
        //Store to local storage/firestore or whever so you can
        //use it to communicate with cloud functions
        //when you want to send out push notifications to a user.
        console.log('Store token to server: ', token);
      })
    );
  }

  //Get the messages in the foreground, afMessaging has a "messaging" observable you
  // can subscribe to. This is only when the app is open
  getMessages(){

    return this.afMessaging.messages;

  }

  //Good practie to allow users to unsubscribe from your nonsense
  deleteToken() {
    if (this.token) {
      this.afMessaging.deleteToken(this.token);
      this.token = null;
      //Also delete the token from whatever sotrage you've put it in too
    }
  }
}
