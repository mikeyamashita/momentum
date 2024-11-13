import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, addCircleOutline, chevronBackOutline, chevronForwardOutline, ellipsisVerticalOutline, pencil, trash } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline, addCircleOutline, add, pencil, trash, ellipsisVerticalOutline })
  }
}
