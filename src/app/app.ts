import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  selector: 'at-root',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('atiempo-web-app');
}
