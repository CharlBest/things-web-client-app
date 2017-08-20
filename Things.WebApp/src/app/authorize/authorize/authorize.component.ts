import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Things, ThingsController } from 'api-typings/bundle';
import { PublicThingService } from 'app/shared/public-thing.service';
import { FormService } from 'app/shared/form.service';

@Component({
  selector: 'app-authorize',
  templateUrl: './authorize.component.html',
  styleUrls: ['./authorize.component.scss']
})
export class AuthorizeComponent implements OnInit {

  thingId: number;
  form: FormGroup;
  formErrors;
  isProcessing = false;

  constructor(private fb: FormBuilder,
    private thingsController: ThingsController,
    private route: ActivatedRoute,
    private router: Router,
    private publicThingService: PublicThingService,
    private formService: FormService) {
  }

  ngOnInit() {
    // This id has to be a root public thing ID
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        this.thingId = +params.get('id');
      }
    });

    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.group({
      password: ['', [
        Validators.required
      ]]
    });
  }

  onSubmit() {
    this.isProcessing = true;

    const viewModel = new Things.Api.ViewModels.Thing.ThingAuthTokenViewModel();
    viewModel.password = this.form.get('password').value;

    // TODO: thingId could be null. prevent form submit if so
    this.thingsController.getPublicThingAuthToken(this.thingId, viewModel).subscribe(data => {
      // TODO: actually only need the thing id not all the data

      this.publicThingService.addToken(this.thingId, data.token);

      const link = ['/thing', this.thingId];
      this.router.navigate(link);
    }, error => {
      this.formErrors = this.formService.showServerErrors(error);

      this.isProcessing = false;
      // this.appInsightsService.trackException(error);
    });
  }
}
