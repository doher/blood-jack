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
  tint?: Tint;
  rotation?: number;
};

export type SpriteDescription = GameObjectDescription & {
  key: string;
  frame?: string | number;
  gameId?: string;
  blendMode?: number;
  scale?: Scale;
};

export type TextDescription = GameObjectDescription & {
  fontSize: number | string;
  color?: string;
  fontFamily?: string;
  stroke?: string;
  maxLines?: number;
  letterSpacing?: number;
  lineSpacing?: number;
  text?: string;
};

export type BitmapTextDescription = GameObjectDescription & {
  font: string;
  text?: string | string[];
  size?: number;
  align?: number;
  rotation?: number;
  tint?: Tint;
};
