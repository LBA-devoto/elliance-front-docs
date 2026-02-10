import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  ActivationStart,
  NavigationEnd,
  Router,
  RoutesRecognized,
} from '@angular/router';
import { filter, map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  componentTitle: string = '';
  client: String = '-' + environment.client;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.subscribe((data) => {
      if (data instanceof ActivationStart) {
        this.componentTitle = data.snapshot.data['title'];
      }
    });
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      startWith(this.router)
    );
  }

  ngOnInit() {
    this.router.events.subscribe((data) => {
      if (data instanceof ActivationStart) {
        this.componentTitle = data.snapshot.data['title'];
      }
    });
  }
}
