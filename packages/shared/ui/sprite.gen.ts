export interface SpritesMap {
    'sprite': 'arrow-left' | 'arrow-right' | 'message' | 'people-flying' | 'people-idle' | 'people-rotate' | 'people-running'
  }
export const SPRITES_META: {
           [Key in keyof SpritesMap]: {
             filePath: string;
             items: Record<SpritesMap[Key], {
                viewBox: string,
                width: number, height: number,
             }>
           }
         } = {
    'sprite': {
    filePath: 'sprite.f55aadf6.svg',
    items: {
      'arrow-left': {
    viewBox: '0 0 24 24',
    width: 24, height: 24,
  },
'arrow-right': {
    viewBox: '0 0 24 24',
    width: 24, height: 24,
  },
'message': {
    viewBox: '0 0 24 24',
    width: 24, height: 24,
  },
'people-flying': {
    viewBox: '0 0 60.224 60.224',
    width: 800, height: 800,
  },
'people-idle': {
    viewBox: '0 0 1200 1200',
    width: 800, height: 800,
  },
'people-rotate': {
    viewBox: '0 0 24 24',
    width: 24, height: 24,
  },
'people-running': {
    viewBox: '0 0 24 24',
    width: 800, height: 800,
  }
    }
}
  };