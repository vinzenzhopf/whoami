import { LobbyMode, LobbySetting, NameAssignmentMode } from '../models/domain/lobbySetting.model';
import { Player } from '../models/domain/player.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Lobby } from '../models/domain/lobby.model';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class LobbyService implements OnInit {
  private baseUrl = '/lobby';

  lobby: Lobby;


  constructor(
    private http: HttpClient
    // private messageService: MessageService
  ) {

  }

  ngOnInit() {
    this.lobby = this.generateDummyData();
  }

  private getBaseUrl(): string {
    return this.baseUrl;
  }

  createLobby(): Promise<Lobby> {
    return this.http.get<Lobby>(this.getBaseUrl()).toPromise();
  }

  getLobby(lobbyId: string): Promise<Lobby> {
    return this.http.get<Lobby>(this.getBaseUrl() + '/' + lobbyId).toPromise();
  }

  lobbyExists(lobbyId: string): Promise<boolean> {
    return this.getLobby(lobbyId)
      .then(l => {
        return (l !== null && l.id !== null && l.id !== '');
      })
      .catch(() => {
        return false;
      });
  }

  generateDummyData(): Lobby {
    const player1: Player = {
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
      players: [ player1, player2, player3, player4, player5, player6, player7 ],
      owner: player1,
      settings: lobbySetting,
      activePlayer: player1
    };
    return lobby;
  }
}
