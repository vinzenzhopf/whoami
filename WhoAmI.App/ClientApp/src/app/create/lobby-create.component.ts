import { LogService } from './../services/log.service';
import { LobbyMode, LobbySetting, NameAssignmentMode } from './../models/domain/lobbySetting.model';
import { LobbyService } from './../services/lobby.service';
import { PlayerService } from './../services/player.service';
import { PlayerImageService } from './../services/playerimage.service';
import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-create-lobby',
  templateUrl: './lobby-create.component.html',
  styleUrls: ['./lobby-create.component.css']
})
export class LobbyCreateComponent implements OnInit{

  createLobbyForm = new FormGroup({

  });

  constructor(
    private router: Router,
    private logger: LogService,
    private playerImageService: PlayerImageService,
    private playerService: PlayerService,
    private lobbyService: LobbyService,
  ) {
  }

  ngOnInit() {

  }

  onCreateLobbySubmit() {
    const settings: LobbySetting = {
      lobbyMode: LobbyMode.Text,
      maxUserCount: 16,
      openForPublic: false,
      nameAssignmentMode: NameAssignmentMode.Everybody
    }
    const player = this.playerService.getPlayer();
    const playerId = player ? player.id : null;
    this.playerService.requestPlayer(playerId)
      .catch(e => {
        console.log('Unknown Player! renew!')
        this.playerService.setPlayer(null);
        return this.playerService.getPlayer();
      })
      .then(p => {
        const pId = p ? p.id : null;
        return this.lobbyService.createLobby(pId, settings);
      })
      .then(l => {
        if (l !== null && l !== undefined && l.id !== null && l.id !== undefined){
          this.router.navigate(['/join', l.id]);
        }else{
          this.logger.log('Create Lobby failed.')
        }
      })
      .catch(e => { this.logger.log(e) });
  }
}
