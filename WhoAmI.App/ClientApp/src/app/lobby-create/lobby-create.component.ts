import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home-create-lobby',
  templateUrl: './lobby-create.component.html',
  styleUrls: ['./lobby-create.component.css']
})
export class LobbyCreateComponent {
  joinLobbyForm = new FormGroup({
    lobbyId: new FormControl('')
  });
  createLobbyForm = new FormGroup({

  });

  constructor() {
  }
}
