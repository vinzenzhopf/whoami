import { PlayerImageService } from '../../services/playerimage.service';
import { PlayerService } from '../../services/player.service';
import { AppModule } from '../../app.module';
import { Component, Inject, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, NgModel, ValidatorFn, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-create-lobby',
  templateUrl: './home-create-lobby.component.html',
  styleUrls: ['./home-create-lobby.component.css']
})
export class HomeCreateLobbyComponent {
  joinLobbyForm = new FormGroup({
    lobbyId: new FormControl('')
  });
  createLobbyForm = new FormGroup({

  });
  // selectedImagePath: string;
  // get name() { return this.yourNameForm.get('name'); }
  // yourNameForm = new FormGroup({
  //   image: new FormControl(''),
  //   name: new FormControl('', [
  //     Validators.required,
  //     Validators.minLength(3),
  //     Validators.pattern('[a-zA-Z0-9]+')
  //   ]),
  // });

  constructor(
    private router: Router,
    private playerImageService: PlayerImageService,
    private playerService: PlayerService
  ) {
    // this.yourNameForm.controls['image'].valueChanges.subscribe((val) => this.onImageUpdated(val));
    // this.yourNameForm.controls['image'].setValue(this.playerImageService.getRandomImageNumber());
  }

  onJoinLobbySubmit() {
  }

  onCreateLobbySubmit() {

  }
}
