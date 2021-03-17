import { EnvironmentService } from './environment.service';
import { LobbySetting } from './../models/domain/lobbySetting.model';
import { LobbyMode, NameAssignmentMode } from '../models/domain/lobbySetting.model';
import { Player } from '../models/domain/player.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Lobby } from '../models/domain/lobby.model';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class LobbyService implements OnInit {
  private baseUrl = '/lobby';

  private _lobby: BehaviorSubject<Lobby> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {
  }

  ngOnInit() {
  }

  public getLobbyObservable(): Observable<Lobby> {
    return this._lobby;
  }

  public getLobby(): Lobby {
    return this._lobby.getValue();
  }

  public setLobby(lobby: Lobby) {
    this._lobby.next(lobby);
  }

  private getBaseUrl(): string {
    return this.environmentService.getApiUrl() + this.baseUrl;
  }

  private getHeaders(): any {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*');
    return headers;
  }

  async updateLobby(lobbyId: string): Promise<Lobby> {
    const l = await this.requestLobby(lobbyId);
    this._lobby.next(l);
    return l;
  }

  public joinLobby(playerId: string, lobbyId: string): Promise<Lobby> {
    const headers = this.getHeaders();
    return this.http.post<Lobby>(this.getBaseUrl() + '/join', { playerId, lobbyId }, { headers })
      .toPromise();
  }

  createLobby(playerId: string, lobbySettings: LobbySetting): Promise<Lobby> {
    const headers = this.getHeaders();
    return this.http.put<Lobby>(this.getBaseUrl(), { playerId, lobbySettings }, { headers })
      .toPromise();
  }

  requestLobby(lobbyId: string): Promise<Lobby> {
    const headers = this.getHeaders();
    return this.http.get<Lobby>(this.getBaseUrl() + '/' + lobbyId, { headers }).toPromise();
  }

  public isPlayerInLobby(playerId: string): boolean {
    const lobby = this.getLobby();
    const playerInLobby = lobby.players.find(x => x.id === playerId);
    return playerInLobby !== null && playerInLobby !== undefined;
  }

  async lobbyExists(lobbyId: string): Promise<boolean> {
    try {
      const l = await this.requestLobby(lobbyId);
      return (l !== null && l.id !== null && l.id !== '');
    } catch (e) {
      return false;
    }
  }

  // generateDummyData(): Lobby {
  //   const player1: Player = {
  //     id: '0001',
  //     name: 'Andre',
  //     characterName: 'Hitler',
  //     guessedCharacterCount: 0,
  //     icon: { id: 1 },
  //     hasSolved: false
  //   };
  //   const player2: Player = {
  //     id: '0002',
  //     name: 'Rupert van da Cow',
  //     characterName: 'Sakamoto',
  //     guessedCharacterCount: 2,
  //     icon: { id: 2 },
  //     hasSolved: false
  //   };
  //   const player3: Player = {
  //     id: '0003',
  //     name: 'Tschnaifert',
  //     characterName: 'Kaiser Nero',
  //     guessedCharacterCount: 42,
  //     icon: { id: 5 },
  //     hasSolved: false
  //   };
  //   const player4: Player = {
  //     id: '0004',
  //     name: 'KevKev',
  //     characterName: '',
  //     guessedCharacterCount: 3,
  //     icon: { id: 10 },
  //     hasSolved: false
  //   };
  //   const player5: Player = {
  //     id: '0005',
  //     name: 'Vinz',
  //     characterName: 'Anulf',
  //     guessedCharacterCount: -1,
  //     icon: { id: 12 },
  //     hasSolved: true
  //   };
  //   const player6: Player = {
  //     id: '0005',
  //     name: 'Vince',
  //     characterName: '',
  //     guessedCharacterCount: -1,
  //     icon: { id: 12 },
  //     hasSolved: false
  //   };
  //   const player7: Player = {
  //     id: '0005',
  //     name: 'Vince',
  //     characterName: 'Test',
  //     guessedCharacterCount: -1,
  //     icon: { id: 12 },
  //     hasSolved: false
  //   };
  //   const lobbySetting: LobbySetting = {
  //     lobbyMode: LobbyMode.Voice,
  //     nameAssignmentMode: NameAssignmentMode.Everybody,
  //     openForPublic: false,
  //     maxUserCount: 8
  //   };
  //   const lobby: Lobby = {
  //     id: '',
  //     players: [ player1, player2, player3, player4, player5, player6, player7 ],
  //     owner: player1,
  //     settings: lobbySetting,
  //     activePlayer: player1
  //   };
  //   return lobby;
  // }
}
