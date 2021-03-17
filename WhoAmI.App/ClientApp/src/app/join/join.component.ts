import { PlayerService } from './../services/player.service';
import { PlayerImageService } from '../services/playerimage.service';
import { AppModule } from './../app.module';
import { Component, Inject, NgModule, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, NgModel, ValidatorFn, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit, OnDestroy {
  private sub: any;

  lobbyId: string;

  constructor(
    private router: Router,
    private playerImageService: PlayerImageService,
    private playerService: PlayerService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      this.lobbyId = id;
      console.log('LobbyId: ' + id);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
