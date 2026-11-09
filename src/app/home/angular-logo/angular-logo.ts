import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'angular-logo',
  templateUrl: './angular-logo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
    role: 'img',
    'aria-label': 'Angular AI In Depth',
  },
})
export class AngularLogo {}
