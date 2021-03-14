import { PlayerService } from './../services/player.service';
import { PlayerImageService } from '../services/playerimage.service';
import { AppModule } from './../app.module';
import { Component, Inject, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, NgModel, ValidatorFn, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [  ],
})
export class HomeComponent {
  selectedImagePath: string;

  get name() { return this.yourNameForm.get('name'); }

  yourNameForm = new FormGroup({
    image: new FormControl(''),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('[a-zA-Z0-9]+')
    ]),
  });

  constructor(
    private router: Router,
    private playerImageService: PlayerImageService,
    private playerService: PlayerService
  ) {
    this.yourNameForm.controls['image'].valueChanges.subscribe((val) => this.onImageUpdated(val));
    this.yourNameForm.controls['image'].setValue(this.playerImageService.getRandomImageNumber());
  }

  private onImageUpdated(value: any) {
    const val = Number.parseInt(value, 10);
    this.selectedImagePath = this.playerImageService.getImage(val);
  }

  getNewImage() {
    this.yourNameForm.controls['image'].setValue(this.playerImageService.getRandomImageNumber());
  }

  onSubmitName() {
    this.playerService.createPlayer(
      this.yourNameForm.value.name,
      this.yourNameForm.value.image
      )
      .then((player) => {
        const playerId = player ? player.id : null;
        this.router.navigate(['/lobby', { playerId: playerId }]);
      })
      .catch(e => {});

  }
}
