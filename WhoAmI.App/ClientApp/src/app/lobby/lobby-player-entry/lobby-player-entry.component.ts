import { PlayerService } from './../../services/player.service';
import { PlayerImageService } from '../../services/playerimage.service';
import { Player, PlayerIcon } from '../../models/domain/player.model';
import { Component, Inject, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getuid } from 'process';
import { Lobby } from 'src/app/models/domain/lobby.model';

@Component({
  selector: 'app-lobby-player-entry',
  templateUrl: './lobby-player-entry.component.html',
  styleUrls: ['./lobby-player-entry.component.css']
})
export class LobbyPlayerEntryComponent {

  @Input() index?: number;
  @Input() lobby?: Lobby;
  @Input() player?: Player;

  constructor(
    private playerImageService: PlayerImageService,
    private PlayerService: PlayerService
  ) {
  }

  isOwner(player: Player): boolean {
    console.log('isOwner='+(player.id === this.lobby.owner.id), player, this.lobby.owner)
    return player.id === this.lobby.owner.id;

  }

  isSelf(player: Player): boolean {
    const viewer = this.PlayerService.getPlayer();
    return player.id === (viewer ? viewer.id : null);
  }

  getPlayerIcon(player: Player): string {
    return this.playerImageService.getImage(player.icon);
  }

  hasPlayerACharacter(player: Player): boolean {
    return player.characterName !== '';
  }

  hasSolved(player: Player): boolean {
    return player.hasSolved;
  }
}

