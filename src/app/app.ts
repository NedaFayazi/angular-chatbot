import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { GlobalLoading } from './shared/global-loading/global-loading';
import { UserMessages } from './shared/user-messages/user-messages';


@Component({
  selector: 'root',
  imports: [
    RouterOutlet,
    UserMessages,
    GlobalLoading,
  ],
  templateUrl: './app.html'
})
export class App {

}
