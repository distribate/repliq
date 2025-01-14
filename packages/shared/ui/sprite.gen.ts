export interface SpritesMap {
    'sprite': 'arrow-left' | 'arrow-right' | 'bell' | 'discord' | 'message' | 'people-flying' | 'people-idle' | 'people-rotate' | 'people-running'
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
    filePath: 'sprite.60316243.svg',
    items: {
      'arrow-left': {
    viewBox: '0 0 24 24',
    width: 24, height: 24,
  },
'arrow-right': {
    viewBox: '0 0 24 24',
    width: 24, height: 24,
  },
'bell': {
    viewBox: '0 0 24 24',
    width: 800, height: 800,
  },
'discord': {
    viewBox: '0 0 127.14 96.36',
    width: 127.14, height: 96.36,
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