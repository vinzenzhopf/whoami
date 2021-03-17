import { PendingChangesGuard } from './guard/pendingChangesGuard.guard';
import { HomeJoinLobbyComponent } from './home/join-lobby/home-join-lobby.component';
import { JoinComponent } from './join/join.component';
import { LogService } from './services/log.service';
import { HomeCreateUserComponent } from './join/create-user/home-create-user.component';
import { CookieService } from 'ngx-cookie-service';
import { HomeComponent } from './home/home.component';
import { LobbyPlayerEntryComponent } from './lobby/lobby-player-entry/lobby-player-entry.component';
import { LobbyComponent } from './lobby/lobby.component';
import { LobbyCreateComponent } from './create/lobby-create.component';
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
    JoinComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'create', component: LobbyCreateComponent },
      { path: 'lobby/:id', component: LobbyComponent }, //, canDeactivate: [PendingChangesGuard]
      { path: 'join/:id', component: JoinComponent },
      { path: '**', component: HomeComponent, redirectTo: '' },
    ])
  ],
  providers: [CookieService, PendingChangesGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
 }
