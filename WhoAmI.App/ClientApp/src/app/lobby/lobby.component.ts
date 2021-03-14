import { LobbySetting } from '../models/domain/lobbySetting.model';
import { Lobby } from '../models/domain/lobby.model';
import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getuid } from 'process';
import { Player, PlayerIcon } from '../models/domain/player.model';
import { LobbyMode, NameAssignmentMode } from '../models/domain/lobbySetting.model';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent {
  lobby: Lobby;

  constructor() {
    this.lobby = this.createDemoLobby();
  }

  createDemoLobby(): Lobby {
    const player: Player = {
      id: '0001',
      name: 'Andre',
      characterName: 'Hitler',
      guessedCharacterCount: 0,
      icon: { id: 1 },
      hasSolved: false
    };
    const player2: Player = {
      id: '0002',
      name: 'Rupert van da Cow',
      characterName: 'Sakamoto',
      guessedCharacterCount: 2,
      icon: { id: 2 },
      hasSolved: false
    };
    const player3: Player = {
      id: '0003',
      name: 'Tschnaifert',
      characterName: 'Kaiser Nero',
      guessedCharacterCount: 42,
      icon: { id: 5 },
      hasSolved: false
    };
    const player4: Player = {
      id: '0004',
      name: 'KevKev',
      characterName: '',
      guessedCharacterCount: 3,
      icon: { id: 10 },
      hasSolved: false
    };
    const player5: Player = {
      id: '0005',
      name: 'Vinz',
      characterName: 'Anulf',
      guessedCharacterCount: -1,
      icon: { id: 12 },
      hasSolved: true
    };
    const player6: Player = {
      id: '0005',
      name: 'Vince',
      characterName: '',
      guessedCharacterCount: -1,
      icon: { id: 12 },
      hasSolved: false
    };
    const player7: Player = {
      id: '0005',
      name: 'Vince',
      characterName: 'Test',
      guessedCharacterCount: -1,
      icon: { id: 12 },
      hasSolved: false
    };
    const lobbySetting: LobbySetting = {
      lobbyMode: LobbyMode.Voice,
      nameAssignmentMode: NameAssignmentMode.Everybody,
      openForPublic: false,
      maxUserCount: 8
    };
    const lobby: Lobby = {
      id: '',
      players: [ player, player2, player3, player4, player5, player6, player7 ],
      owner: player,
      settings: lobbySetting,
      activePlayer: player
    };
    return lobby;
  }

  isOwner(player: Player): boolean {
    return player.id === this.lobby.owner.id;
  }

  getPlayerIcon(playerIcon: PlayerIcon): string {
    if ( playerIcon === null) {
      return '/assets/img/playericons/00.png';
    } else {
      return '/assets/img/playericons/' + this.zeroPad(playerIcon.id, 2) + '.png';
    }
  }

  zeroPad(num, places) {
    const zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join('0') + num;
  }

  hasPlayerACharacter(player: Player): boolean {
    return player.characterName !== '';
  }
}

