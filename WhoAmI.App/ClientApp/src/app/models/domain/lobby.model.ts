import { LobbySetting } from './lobbySetting.model';
import { Player } from './player.model';

export interface Lobby {
  id: string;
  owner: Player;
  players: Player[];
  settings: LobbySetting;
  activePlayer: Player;
}
