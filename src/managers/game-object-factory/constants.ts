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

export type GameObjectDescription = {
  position: Position;
  origin?: Origin;
  hide?: boolean;
};

export type SpriteDescription = GameObjectDescription & {
  key: string;
  frame?: string | number;
  gameId?: string;
  tint?: Tint;
  rotation?: number;
  blendMode?: number;
  scale?: Scale;
};

export type TextDescription = GameObjectDescription & {
  fontSize: number | string;
  color?: string;
  fontFamily?: string;
  stroke?: string;
  maxLines?: number;
};

export type BitmapTextDescription = GameObjectDescription & {
  font: string;
  text?: string | string[];
  size?: number;
  align?: number;
  rotation?: number;
  tint?: Tint;
};
