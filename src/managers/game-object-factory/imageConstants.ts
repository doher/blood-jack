import type { SpriteSheetLoadingLayout } from '../animation-manager/constants.ts';

export const enum UiControlsFrame {
  BLACK_BUTTON = 'blackBtn.png',
  RED_BUTTON = 'redBtn.png',
  GREEN_BUTTON = 'greenBtn.png',
  GRAY_BUTTON = 'grayBtn.png',
  YELLOW_BUTTON = 'yellowBtn.png',
  GRAY_TEXT_BOX = 'textbox.png',
}

export const enum ImageLoadingKey {
  CARD_FRONT = 'CARD_FRONT',
  CARD_BACK = 'CARD_BACK',
  CLUBS = 'CLUBS',
  DIAMONDS = 'DIAMONDS',
  HEARTS = 'HEARTS',
  SPADES = 'SPADES',
  SMALL_CLUBS = 'SMALL_CLUBS',
  SMALL_DIAMONDS = 'SMALL_DIAMONDS',
  SMALL_HEARTS = 'SMALL_HEARTS',
  SMALL_SPADES = 'SMALL_SPADES',
  TABLE = 'TABLE',
  EYE_BACK = 'EYE_BACK',
  EYE_TOP = 'EYE_TOP',
  MESSAGE = 'MESSAGE',
  UI_CONTROLS = 'BLACK_BUTTON',
  CURSOR_IDLE = 'CURSOR_IDLE',
  CURSOR_CLICK = 'CURSOR_CLICK',
  CURSOR_POINT = 'CURSOR_POINT',
  ARM = 'ARM',
}

export type ImageAsset = {
  key: string;
  imagePath: string;
};

export const SPRITE_SHEET_LAYOUTS: SpriteSheetLoadingLayout[] = [
  {
    key: ImageLoadingKey.UI_CONTROLS,
    imagePath: 'assets/images/ui-controls/',
    atlasDataPath: 'images/ui-controls/ui-controls.json',
  },
];

export const IMAGE_LAYOUTS: ImageAsset[] = [
  {
    key: ImageLoadingKey.CARD_FRONT,
    imagePath: 'images/card/card-front.png',
  },
  {
    key: ImageLoadingKey.CARD_BACK,
    imagePath: 'images/card/card-back.png',
  },
  {
    key: ImageLoadingKey.CLUBS,
    imagePath: 'images/card/suits/clubs.png',
  },
  {
    key: ImageLoadingKey.DIAMONDS,
    imagePath: 'images/card/suits/diamonds.png',
  },
  {
    key: ImageLoadingKey.HEARTS,
    imagePath: 'images/card/suits/hearts.png',
  },
  {
    key: ImageLoadingKey.SPADES,
    imagePath: 'images/card/suits/spades.png',
  },
  {
    key: ImageLoadingKey.SMALL_CLUBS,
    imagePath: 'images/card/small-suits/small-clubs.png',
  },
  {
    key: ImageLoadingKey.SMALL_DIAMONDS,
    imagePath: 'images/card/small-suits/small-diamonds.png',
  },
  {
    key: ImageLoadingKey.SMALL_HEARTS,
    imagePath: 'images/card/small-suits/small-hearts.png',
  },
  {
    key: ImageLoadingKey.SMALL_SPADES,
    imagePath: 'images/card/small-suits/small-spades.png',
  },
  {
    key: ImageLoadingKey.TABLE,
    imagePath: 'images/table/table.png',
  },
  {
    key: ImageLoadingKey.EYE_BACK,
    imagePath: 'images/monster-eye/eyeBack.png',
  },
  {
    key: ImageLoadingKey.EYE_TOP,
    imagePath: 'images/monster-eye/eyeTop.png',
  },
  {
    key: ImageLoadingKey.MESSAGE,
    imagePath: 'images/message/message.png',
  },
  {
    key: ImageLoadingKey.CURSOR_IDLE,
    imagePath: 'images/cursor/cursor-idle.png',
  },
  {
    key: ImageLoadingKey.CURSOR_CLICK,
    imagePath: 'images/cursor/cursor-click.png',
  },
  {
    key: ImageLoadingKey.CURSOR_POINT,
    imagePath: 'images/cursor/cursor-point.png',
  },
  {
    key: ImageLoadingKey.ARM,
    imagePath: 'images/cursor/arm.png',
  },
];
