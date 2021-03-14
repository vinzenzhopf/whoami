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
    private playerImageService: PlayerImageService
  ) {

  }

  isOwner(player: Player): boolean {
    return player.id === this.lobby.owner.id;
  }

  isSelf(player: Player): boolean {
    return player.id === '0005'; //TODO
  }

  getPlayerIcon(playerIcon: PlayerIcon): string {
    return this.playerImageService.getImage(playerIcon.id);
  }

  zeroPad(num, places) {
    const zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
  }

  hasPlayerACharacter(player: Player): boolean {
    return player.characterName !== '';
  }

  hasSolved(player: Player): boolean {
    return player.hasSolved;
  }
}

