import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MdDialog } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { Observable } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';
import { TutorialService, TutorialArea } from '../../tutorial/tutorial.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  logedInUserId: number = this.authService.getLogedInUserId();
  activeNavigation = Navigation.Primary;
  navigationTypes = Navigation;
  navigationBackTitle = '';
  backRouterPath: string;

  consoleLogs = [];
  showConsoleLogs = false;
  logoClickCount = 0;
  navLogoTimeout: any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private titleService: Title,
    private location: Location,
    private tutorial: TutorialService) {

    if (environment.production) {
      this.trackConsoleLogger();
    }
  }

  trackConsoleLogger() {
    const oldConsoleError = console.error;
    const oldConsoleInfo = console.info;
    const oldConsoleLog = console.log;
    const oldConsoleTrace = console.trace;
    const oldConsoleWarn = console.warn;

    const consoleLogsStore = [];

    console.error = function () {
      for (const arg in arguments) {
        if (arg) {
          consoleLogsStore.push(arguments[arg]);
        }
      }
      oldConsoleError.apply(console, arguments);
    }

    console.info = function () {
      for (const arg in arguments) {
        if (arg) {
          consoleLogsStore.push(arguments[arg]);
        }
      }
      oldConsoleInfo.apply(console, arguments);
    }

    console.log = function () {
      for (const arg in arguments) {
        if (arg) {
          consoleLogsStore.push(arguments[arg]);
        }
      }
      oldConsoleLog.apply(console, arguments);
    }

    console.trace = function () {
      for (const arg in arguments) {
        if (arg) {
          consoleLogsStore.push(arguments[arg]);
        }
      }
      oldConsoleTrace.apply(console, arguments);
    }

    console.warn = function () {
      for (const arg in arguments) {
        if (arg) {
          consoleLogsStore.push(arguments[arg]);
        }
      }
      oldConsoleWarn.apply(console, arguments);
    }

    this.consoleLogs = consoleLogsStore;
  }

  ngOnInit() {
    this.authService.logedInUserId$.subscribe(id => {
      this.logedInUserId = id;
    });

    this.router.events
      .map(() => this.route)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .subscribe((event) => {
        if (event.snapshot.data) {
          const title = event.snapshot.data['title'];
          if (title !== null) {
            this.titleService.setTitle(title);
            this.navigationBackTitle = title;
          }

          const nav = event.snapshot.data['nav'] as Navigation;
          if (nav !== null) {
            this.activeNavigation = nav;
          }

          const backRouterPath = event.snapshot.data['backRouterPath'] as string;
          if (backRouterPath !== null) {
            this.backRouterPath = backRouterPath;
          } else {
            this.backRouterPath = null;
          }
        }
      });

    if (!this.tutorial.hasDoneTutorial(TutorialArea.firstTimeUser)) {
      this.router.navigate(['/tutorial', TutorialArea.firstTimeUser]);
    }
  }

  // TODO: think about adding dialog after componet names if its a dialog view/component

  onLogoClick() {
    this.logoClickCount++;
    clearTimeout(this.navLogoTimeout);

    if (this.logoClickCount <= 5) {
      this.navLogoTimeout = setTimeout(() => {
        this.logoClickCount = 0;
        this.router.navigate(['/']);
      }, 200);
    } else {
      this.logoClickCount = 0;
      this.showConsoleLogs = true;
    }
  }

  logout() {
    this.authService.removeToken();
  }

  back() {
    if (this.backRouterPath !== null && this.backRouterPath !== undefined) {
      this.router.navigate([this.backRouterPath]);
    } else {
      // TODO: check if there is a back otherwise redirect to home/discover page
      this.location.back();
    }
  }
}

// TODO: move this to another file
export enum Navigation {
  Primary = 1,
  Back = 2
}
