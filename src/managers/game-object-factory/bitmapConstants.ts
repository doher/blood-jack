export const enum BitmapFontLoadingKey {
  RED_CARD_FONT = 'RED_CARD_FONT',
  BLACK_CARD_FONT = 'BLACK_CARD_FONT',
}

export type BitmapFontAsset = {
  key: BitmapFontLoadingKey;
  imagePath: string;
  fontDataPath: string;
};

export const BITMAP_FONT_LAYOUTS: BitmapFontAsset[] = [
  {
    key: BitmapFontLoadingKey.RED_CARD_FONT,
    imagePath: 'bitmap-fonts/card/red-card-font-export.png',
    fontDataPath: 'bitmap-fonts/card/red-card-font-export.xml',
  },
  {
    key: BitmapFontLoadingKey.BLACK_CARD_FONT,
    imagePath: 'bitmap-fonts/card/black-card-font-export.png',
    fontDataPath: 'bitmap-fonts/card/black-card-font-export.xml',
  },
];
