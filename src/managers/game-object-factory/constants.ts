export type Position = {
  x: number;
  y: number;
};

export type Scale = {
  x: number;
  y: number;
};

export type Origin = {
  x: number;
  y: number;
};

export type Tint = {
  topLeft: number;
  topRight?: number;
  bottomLeft?: number;
  bottomRight?: number;
};

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

export type GameObjectsBitmapTextDescription = {
  position: Position;
  font: string;
  text?: string | string[];
  size?: number;
  align?: number;
  tint?: Tint;
  origin?: Origin;
  rotation?: number;
};
