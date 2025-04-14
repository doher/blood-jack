const enum BitmapFontLoadingKey {
  CARD_VALUES = 'CARD_VALUES',
}

export type BitmapFontAsset = {
  key: BitmapFontLoadingKey;
  imagePath: string;
  fontDataPath: string;
};

export const BITMAP_FONT_LAYOUTS: BitmapFontAsset[] = [
  {
    key: BitmapFontLoadingKey.CARD_VALUES,
    imagePath: 'bitmap-fonts/card/card-values.png',
    fontDataPath: 'bitmap-fonts/card/card-values.xml',
  },
];
