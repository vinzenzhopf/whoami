import { Observable } from 'rxjs';
import { LobbyService } from 'src/app/services/lobby.service';
import { PlayerService } from './../services/player.service';
import { LobbySetting } from '../models/domain/lobbySetting.model';
import { Lobby } from '../models/domain/lobby.model';
import { ApplicationRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getuid } from 'process';
import { Player, PlayerIcon } from '../models/domain/player.model';
import { LobbyMode, NameAssignmentMode } from '../models/domain/lobbySetting.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit, OnDestroy {
  private sub: any;

  lobbyObservable: Observable<Lobby>;
  playerObservable: Observable<Player>;
  lobby: Lobby;
  lobbyId: string;
  player: Player;
  playerId: string;

  lobbyValid: boolean = false;
  playerValid: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private lobbyService: LobbyService,
  ) {
    this.lobbyValid = false;
    this.playerValid = false;

    this.lobbyObservable = this.lobbyService.getLobbyObservable();
    this.playerObservable = this.playerService.getPlayerObservable();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      this.lobbyId = id;
      console.log('LobbyId: ' + id);

      this.lobbyService.updateLobby(id);
      this.playerService.updatePlayer();
    });
    this.playerService.getPlayerObservable().subscribe(p => {
      this.player = p;
      this.playerId = p ? p.id : null;
      this.playerValid = (p && p.id && p.id !== null);
      console.log("Lobby: PlayerUpdated", this.player);
      if(!this.playerValid){
        console.log("Player not valid!");
        this.router.navigate(['/join', this.lobbyId ]);
      }
    });
    this.lobbyService.getLobbyObservable().subscribe(l => {
      this.lobby = l;
      this.lobbyId = l ? l.id : null;
      this.lobbyValid = l !== null;
      console.log("Lobby: LobbyUpdated", this.lobby);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

