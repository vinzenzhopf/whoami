import { AppCookieService } from './appCookieService.service';
import { Player } from './../models/domain/player.model';
import { EnvironmentService } from './environment.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventEmitter } from 'protractor';

@Injectable({
  providedIn: 'root',
})
export class PlayerService implements OnInit {
  private COOKIE_PLAYER_ID = 'PLAYER_ID';
  private baseUrl = '/player';

  // player: Player;

  private _player: BehaviorSubject<Player> = new BehaviorSubject(null);

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService,
    // private appCookieService: AppCookieService
  ) {
    // const playerId = this.appCookieService.get(this.COOKIE_PLAYER_ID);
    // if(playerId) {
    //   this.requestPlayer(playerId)
    //     .then(p => this._player.next)
    //     .catch(e => {
    //       this.appCookieService.remove(this.COOKIE_PLAYER_ID);
    //       this.
    //     }
    // }
  }

  ngOnInit() {

  }

  getPlayerObservable(): Observable<Player> {
    return this._player;
  }

  getPlayer(): Player {
    return this._player.getValue();
  }

  setPlayer(player: Player): void {
    this._player.next(player);
  }

  private getHeaders(): any {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json')
      .append('Access-Control-Allow-Headers', 'Content-Type')
      .append('Access-Control-Allow-Methods', 'GET')
      .append('Access-Control-Allow-Origin', '*');
    return headers;
  }

  private getBaseUrl(): string {
    return this.environmentService.getApiUrl() + this.baseUrl;
  }

  public async createPlayer(name: string, image: number): Promise<Player> {
    console.log("Create Player " + name + ' ' + image);
    const headers = this.getHeaders();
    return await this.http.put<Player>(this.getBaseUrl(), { name, image }, { headers }).toPromise()
      .then(p => {
        this._player.next(p);
        return p;
      });
  }

  public async requestPlayer(playerId: string) {
    const headers = this.getHeaders();
    return await this.http.get<Player>(this.getBaseUrl() + '/' + playerId, { headers }).toPromise()
      .then(p => {
        this._player.next(p);
        return p;
      });
  }

  public async updatePlayer() {
    const headers = this.getHeaders();
    const player = this._player.getValue();
    const playerId = player ? player.id : null;
    return await this.http.get<Player>(this.getBaseUrl() + '/' + playerId, { headers }).toPromise()
      .then(p => {
        this._player.next(p);
        return p;
      });
  }

  public hasPlayer(): boolean {
    const player = this._player.getValue();
    return (player !== null &&
            player !== undefined &&
            player.id !== null &&
            player.id !== undefined
    );
  }

  // generateDummyData(): Player {
  //   const player5: Player = {
  //     id: '0005',
  //     name: 'Vinz',
  //     characterName: 'Anulf',
  //     guessedCharacterCount: -1,
  //     icon: { id: 12 },
  //     hasSolved: true
  //   };
  //   return player5;
  // }
}
