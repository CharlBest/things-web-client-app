import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThingsController, Things } from 'api-typings/bundle';
import { PublicThingService } from 'app/shared/public-thing.service';
import { MdSnackBar } from '@angular/material';
import { TutorialArea, TutorialService } from 'app/tutorial/tutorial.service';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss']
})
export class DescriptionComponent implements OnInit {

  thing: Things.Api.Models.ThingModel;
  thingId: number;
  isLoading = true;

  constructor(private thingsController: ThingsController,
    private route: ActivatedRoute,
    private router: Router,
    private publicThingService: PublicThingService,
    public snackBar: MdSnackBar,
    private tutorial: TutorialService) { }

  ngOnInit() {
    if (!this.tutorial.hasDoneTutorial(TutorialArea.editThingDescription)) {
      this.router.navigate(['/tutorial', TutorialArea.editThingDescription]);
    }

    this.thingId = +this.route.snapshot.params['id'];

    // TODO: This should actually be onRouterParamChange and check other places as well
    // TODO: catch error from server if any
    if (this.thing == null) {
      this.thingsController.readThing(this.thingId).subscribe(data => {
        this.thing = data;
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
    }
  }

  onEditorSave(content: string) {
    let link = ['/edit', this.thingId];

    // not equal has to be like that
    if (content !== '' && content !== this.thing.description.content) {
      const viewModel = new Things.Api.ViewModels.Thing.Edit.EditThingDescriptionViewModel;
      viewModel.content = content;

      const rootPublicThingId = this.publicThingService.getRootThingIdFromThing(this.thing.parentHierarchy, this.thing.thing.id);
      if (rootPublicThingId === null) {
        this.thingsController.editThingDescription(this.thingId, viewModel).subscribe(data => {
          this.router.navigate(link);
        });
      } else {
        const token = this.publicThingService.getPublicThingValue(rootPublicThingId);
        if (token !== null) {
          this.thingsController.editPublicThingDescription(this.thingId, token, viewModel).subscribe(data => {
            this.router.navigate(link);
          });
        } else {
          const snackBarRef = this.snackBar.open('Unauthorized access!', 'Authorize', {
            duration: 6000
          });

          // Snack bar authorize
          snackBarRef.onAction().subscribe(() => {
            // The id from the public thing service could potentially not be a root public thing ID
            link = ['/authorize', this.publicThingService.getRootThingIdFromThing(this.thing.parentHierarchy, this.thing.thing.id)];
            this.router.navigate(link);
          });
        }
      }
    } else {
      this.router.navigate(link);
    }
  }
}
