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
}

export type ImageAsset = {
  key: string;
  imagePath: string;
};

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
    imagePath: 'images/monsterEye/eyeBack.png',
  },
  {
    key: ImageLoadingKey.EYE_TOP,
    imagePath: 'images/monsterEye/eyeTop.png',
  },
  {
    key: ImageLoadingKey.MESSAGE,
    imagePath: 'images/message/message.png',
  },
];
