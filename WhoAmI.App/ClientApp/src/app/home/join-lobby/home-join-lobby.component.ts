import { PlayerImageService } from './../../services/playerimage.service';
import { PlayerService } from './../../services/player.service';
import { AppModule } from '../../app.module';
import { Component, Inject, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, NgModel, ValidatorFn, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { LobbyService } from 'src/app/services/lobby.service';

@Component({
  selector: 'app-home-join-lobby',
  templateUrl: './home-join-lobby.component.html',
  styleUrls: ['./home-join-lobby.component.css']
})
export class HomeJoinLobbyComponent {

  joinLobbyForm = new FormGroup({
    lobbyId: new FormControl('')
  });
  createLobbyForm = new FormGroup({
  });

  constructor(
    private router: Router,
    private lobbyService: LobbyService,
    private playerService: PlayerService
  ) {
  }

  onJoinLobbySubmit() {
    const lobbyId = this.joinLobbyForm.get('lobbyId').value;
    this.lobbyService.lobbyExists(lobbyId).then(b => {
      if (b) {
        this.router.navigate(['/lobby', { lobbyId: lobbyId }]);
      } else {
        //Error
        //this.joinLobbyForm.setValidators()
      }
    });
  }

  onCreateLobbySubmit() {
    this.router.navigate(['/create']);
  }
}
