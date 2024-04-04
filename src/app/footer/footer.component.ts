import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  version: string;
  constructor(
    private dataService: DataService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.version = this.configService.getVersion();
  }

  onAboutClick() {
    var analytics = {
      title: 'About_Bottom',
      activity_type: 'navigation',
    }
    this.dataService.logAnalytics(analytics);
  }

}
