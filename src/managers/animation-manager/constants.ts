import { getAnimationAssetPath, getImagePath } from './helpers.ts';

export const enum AnimationLoadingKey {
  DEALER_TALK = 'DEALER_TALK',
  DEALER_ANGRY_TALK = 'DEALER_ANGRY_TALK',
  DEALER_SMILE = 'DEALER_SMILE',
  DEALER_SAD = 'DEALER_SAD',
  DEALER_EAR_MOVEMENT = 'DEALER_EAR_MOVEMENT',
  RAIN = 'RAIN',
}

interface AnimationLoadingLayout {
  loadingKey: string;
  imagePath: string;
  atlasDataPath: string;
}

export const ANIMATION_LOADING_LAYOUTS: AnimationLoadingLayout[] = [
  {
    loadingKey: AnimationLoadingKey.DEALER_TALK,
    atlasDataPath: getAnimationAssetPath('dealer/talk/talkAnimation.json'),
    imagePath: getImagePath(getAnimationAssetPath('dealer/talk/')),
  },
  {
    loadingKey: AnimationLoadingKey.DEALER_ANGRY_TALK,
    atlasDataPath: getAnimationAssetPath(
      'dealer/angry-talk/angryAnimation.json',
    ),
    imagePath: getImagePath(getAnimationAssetPath('dealer/angry-talk/')),
  },
  {
    loadingKey: AnimationLoadingKey.DEALER_SMILE,
    atlasDataPath: getAnimationAssetPath('dealer/smile/smileAnimation.json'),
    imagePath: getImagePath(getAnimationAssetPath('dealer/smile/')),
  },
  {
    loadingKey: AnimationLoadingKey.DEALER_SMILE,
    atlasDataPath: getAnimationAssetPath('dealer/smile/smileAnimation.json'),
    imagePath: getImagePath(getAnimationAssetPath('dealer/smile/')),
  },
  {
    loadingKey: AnimationLoadingKey.DEALER_SAD,
    atlasDataPath: getAnimationAssetPath('dealer/sad/sadAnimation.json'),
    imagePath: getImagePath(getAnimationAssetPath('dealer/sad/')),
  },
  {
    loadingKey: AnimationLoadingKey.DEALER_EAR_MOVEMENT,
    atlasDataPath: getAnimationAssetPath(
      'dealer/movements-ears/movementsEarsAnimation.json',
    ),
    imagePath: getImagePath(getAnimationAssetPath('dealer/movements-ears/')),
  },
  {
    loadingKey: AnimationLoadingKey.RAIN,
    atlasDataPath: getAnimationAssetPath('rain/rain.json'),
    imagePath: getImagePath(getAnimationAssetPath('rain/')),
  },
];
