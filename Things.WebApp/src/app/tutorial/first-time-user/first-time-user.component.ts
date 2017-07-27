import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { TutorialArea, TutorialService } from 'app/tutorial/tutorial.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-time-user',
  templateUrl: './first-time-user.component.html',
  styleUrls: ['./first-time-user.component.scss']
})
export class FirstTimeUserComponent {

  @Output() onDone: EventEmitter<TutorialArea> = new EventEmitter();

  constructor(private tutorialService: TutorialService,
    private router: Router) { }

  goToDiscover() {
    this.tutorialService.setTutorialAsDone(TutorialArea.firstTimeUser);
    this.router.navigate(['/']);
  }

  goToSignUp() {
    this.tutorialService.setTutorialAsDone(TutorialArea.firstTimeUser);
    this.router.navigate(['/create-user']);
  }
}
