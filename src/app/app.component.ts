import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'solarspell';

  constructor(
    private dataService: DataService,
  ) {}

  onNavClick(navType, event) {
    var analytics = {
      title: '',
      activity_type: 'navigation',
    }

    if(navType == 'Logo'){
      analytics.title = 'Logo';
    }

    if(navType == 'Hamburger'){
      if($(event.currentTarget).attr('class').includes('collapsed')) { 
        analytics.title = 'Hamburger expanded';
      } else {
        analytics.title = 'Hamburger collapsed';
      }
    }

    if(navType == 'Home'){
      analytics.title = 'Home';
    }

    if(navType == 'Index'){
      analytics.title = 'Index';
    }

    if(navType == 'About'){
      analytics.title = 'About';
    }

    this.dataService.logAnalytics(analytics);
  }
}
