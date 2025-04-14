export const enum AnimationLoadingKey {
  DEALER_TALK = 'DEALER_TALK',
  DEALER_ANGRY_TALK = 'DEALER_ANGRY_TALK',
  DEALER_SMILE = 'DEALER_SMILE',
  DEALER_SAD = 'DEALER_SAD',
  DEALER_EAR_MOVEMENT = 'DEALER_EAR_MOVEMENT',
  RAIN = 'RAIN',
}

type AnimationLoadingLayout = {
  key: AnimationLoadingKey;
  imagePath: string;
  atlasDataPath: string;
};

export const ANIMATION_LOADING_LAYOUTS: AnimationLoadingLayout[] = [
  {
    key: AnimationLoadingKey.DEALER_TALK,
    imagePath: 'assets/animations/dealer/talk/',
    atlasDataPath: 'animations/dealer/talk/talkAnimation.json',
  },
  {
    key: AnimationLoadingKey.DEALER_ANGRY_TALK,
    imagePath: 'assets/animations/dealer/angry-talk/',
    atlasDataPath: 'animations/dealer/angry-talk/angryAnimation.json',
  },
  {
    key: AnimationLoadingKey.DEALER_SMILE,
    imagePath: 'assets/animations/dealer/smile/',
    atlasDataPath: 'animations/dealer/smile/smileAnimation.json',
  },
  {
    key: AnimationLoadingKey.DEALER_SMILE,
    imagePath: 'assets/animations/dealer/smile/',
    atlasDataPath: 'animations/dealer/smile/smileAnimation.json',
  },
  {
    key: AnimationLoadingKey.DEALER_SAD,
    imagePath: 'assets/animations/dealer/sad/',
    atlasDataPath: 'animations/dealer/sad/sadAnimation.json',
  },
  {
    key: AnimationLoadingKey.DEALER_EAR_MOVEMENT,
    imagePath: 'assets/animations/dealer/movements-ears/',
    atlasDataPath:
      'animations/dealer/movements-ears/movementsEarsAnimation.json',
  },
  {
    key: AnimationLoadingKey.RAIN,
    imagePath: 'assets/animations/rain/',
    atlasDataPath: 'animations/rain/rain.json',
  },
];
