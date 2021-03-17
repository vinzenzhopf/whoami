import { Player } from './../../models/domain/player.model';
import { LobbyService } from 'src/app/services/lobby.service';
import { PlayerService } from './../../services/player.service';
import { PlayerImageService } from '../../services/playerimage.service';
import { AppModule } from './../../app.module';
import { Component, Inject, Input, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, NgModel, ValidatorFn, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-create-user',
  templateUrl: './home-create-user.component.html',
  styleUrls: ['./home-create-user.component.css']
})
export class HomeCreateUserComponent {
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

  @Input() lobbyId?: string;

  constructor(
    private router: Router,
    private playerImageService: PlayerImageService,
    private playerService: PlayerService,
    private lobbyService: LobbyService
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
      .then(player =>{
        this.playerService.setPlayer(player);
        console.log('Player created:', player);
        return player;
      })
      // .catch(e => { console.log('Error: Player could not be created.', e) })
      .then((p) => {
        return this.lobbyService.joinLobby(p.id, this.lobbyId)
      })
      .then((l) => {
        this.router.navigate(['/lobby', this.lobbyId]);
      })
      .catch(e => { console.log('Error: Player could not be created or Lobby could not be joined.', e) });
  }
}
