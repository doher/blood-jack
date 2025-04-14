export interface Position {
  x: number;
  y: number;
}

export interface Scale {
  x: number;
  y: number;
}

export interface Origin {
  x: number;
  y: number;
}

export interface Tint {
  topLeft: number;
  topRight?: number;
  bottomLeft?: number;
  bottomRight?: number;
}

export interface GameObjectDescription {
  position: Position;
  key: string;
  frame?: string | number;
  gameId?: string;
  origin?: Origin;
  scale?: Scale;
  tint?: Tint;
  rotation?: number;
  hide?: boolean;
  blendMode?: number;
}
