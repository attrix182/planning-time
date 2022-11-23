import { AfterViewInit, Component } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AngularFireAnalytics } from '@angular/fire/analytics';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  constructor(private primengConfig: PrimeNGConfig,private analytics: AngularFireAnalytics) {
    this.primengConfig.ripple = true;
  }

  ngAfterViewInit() {
    this.analytics.logEvent('page_view_home');
  }

}
