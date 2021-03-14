import { Player } from '../models/domain/player.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService implements OnInit {
  private baseUrl = '/player';

  player: Player;

  constructor(
    private http: HttpClient
  ) {
  }

  ngOnInit() {
  }

  public createPlayer(name: string, image: number): Promise<Player> {
    return this.http.put<Player>(this.getBaseUrl(), { name, image }).toPromise()
        .then(player => {
          this.player = player;
          return player;
        });
  }

  private getBaseUrl(): string {
    return this.baseUrl;
  }

  generateDummyData(): Player {
    const player5: Player = {
      id: '0005',
      name: 'Vinz',
      characterName: 'Anulf',
      guessedCharacterCount: -1,
      icon: { id: 12 },
      hasSolved: true
    };
    return player5;
  }
}
