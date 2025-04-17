export const enum GameStates {
  IDLE = 'IDLE',
  START_GAME = 'START_GAME',
  PLAYER_TURN = 'PLAYER_TURN',
  DEALER_TURN = 'DEALER_TURN',
  PLAYER_WIN = 'PLAYER_WIN',
  DEALER_WIN = 'DEALER_WIN',
  PUSH = 'PUSH',
  END_GAME = 'END_GAME',
}

export const enum BlackjackMangerEvents {
  CHANGE_GAME_STATE = 'BlackjackMangerEvents_CHANGE_GAME_STATE',
}
