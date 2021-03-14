export interface LobbySetting {
  maxUserCount: number;
  openForPublic: boolean;
  nameAssignmentMode: NameAssignmentMode;
  lobbyMode: LobbyMode;
}

export enum NameAssignmentMode {
  Everybody = 0,
  Random
}

export enum LobbyMode {
  Text = 0,
  Voice
}
