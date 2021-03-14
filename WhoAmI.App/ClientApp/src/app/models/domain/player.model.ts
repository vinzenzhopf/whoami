import { Serializable } from '../base/serializable.model';

export interface Player {
  id: string;
  name: string;
  characterName: string;
  hasSolved: boolean;
  guessedCharacterCount: number;
  icon: PlayerIcon;
}

export interface PlayerIcon {
  id: number;
}
