import { HomeCreateLobbyComponent } from './lobby-create/create-lobby/home-create-lobby.component';
import { HomeCreateUserComponent } from './home/create-user/home-create-user.component';
import { HomeJoinLobbyComponent } from './home/join-lobby/home-join-lobby.component';
import { CookieService } from 'ngx-cookie-service';
import { HomeComponent } from './home/home.component';
import { LobbyPlayerEntryComponent } from './lobby/lobby-player-entry/lobby-player-entry.component';
import { LobbyComponent } from './lobby/lobby.component';
import { LobbyCreateComponent } from './lobby-create/lobby-create.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LobbyCreateComponent,
    LobbyComponent,
    LobbyPlayerEntryComponent,
    HomeCreateUserComponent,
    HomeJoinLobbyComponent,
    HomeCreateLobbyComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'create', component: HomeCreateLobbyComponent },
      { path: 'lobby', component: LobbyComponent },
    ])
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
 }
