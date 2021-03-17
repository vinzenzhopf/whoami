import { Lobby } from './../models/domain/lobby.model';
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { environment } from "src/environments/environment";

export const SIGNALR_URL = environment.signalRUrl;

@Injectable({
  providedIn: 'root'
})
export class LobbyDataService {
  private connectionEstablished = new Subject<Boolean>();
  private currentLobby = new Subject<Lobby>();
  private hubConnection: HubConnection;
  private connected = false;

  constructor() {
    this.connectionEstablished.subscribe((x) => {
        this.connected = x as boolean;
        if (x) {
            this.hubConnection.onclose(() => {
                this.createConnection();
                this.registerOnServerEvents();
                this.startConnection();
            });
        }
    });
  }

  private createConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
        .withUrl(SIGNALR_URL)
        .build();
  }

  private startConnection(): any {
    this.hubConnection
        .start()
        .then(() => {
            this.connectionEstablished.next(true);
        })
        .catch(err => {
            this.connectionEstablished.next(false);
            console.log(`Error while establishing connection to ${this.SIGNALR_URL}, retrying...`);
            console.log(err);
            setTimeout(this.startConnection(), 5000);
        });
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on('LobbyUpdate', (data: Lobby) => {
        this.currentLobby.next(data);
    });
  }
}
