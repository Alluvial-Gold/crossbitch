export interface Icon {
  name: string;
  path: string;
}

export const Icons: Icon[] = [
  {
    name: 'circle',
    path: 'M 10 50 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0'
  },
  {
    name: 'triangle',
    path: 'M 50 15 L 90 85 L 10 85 Z'
  },
  {
    name: 'x',
    path: 'M 20 10 L 90 80 L 80 90 L 10 20 Z M 80 10 L 90 20 L 20 90 L 10 80 Z'
  },
  {
    name: 'circleLeft',
    path: 'M 10 50 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0 Z M 50 80 L 50 20 A 30 30 0 1 1 50 80 Z'
  },
  {
    name: 'circleRight',
    path: 'M 10 50 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0 Z M 50 20 L 50 80 A 30 30 0 1 1 50 20 Z'
  },
  {
    name: 'triangleBottomLeft',
    path: 'M 10 10 L 10 90 L 90 90 Z'
  },
  {
    name: 'triangleBottomRight',
    path: 'M 90 90 L 10 90 L 90 10 Z'
  },
  {
    name: 'triangleTopLeft',
    path: 'M 10 10 L 90 10 L 10 90 Z'
  },
  {
    name: 'triangleTopRight',
    path: 'M 10 10 L 90 10 L 90 90 Z'
  },
  {
    name: 'openCircle',
    path: 'M 10 50 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0 Z M 20 50 a 30 30 0 1 1 60 0 a 30 30 0 1 1 -60 0 Z'
  },
  {
    name: 'trianglesHorizontal',
    path: 'M 10 10 L 90 90 L 90 10 L 10 90 Z'
  },
  {
    name: 'trianglesVertical',
    path: 'M 10 10 L 90 90 L 10 90 L 90 10 Z'
  },
  {
    name: 'H',
    path: 'M 20 10 h 10 v 35 h 40 v -35 h 10 v 80 h -10 v -35 h -40 v 35 h -10 Z'
  },
  {
    name: 'curvyDiamond',
    path: 'M 50 10 C 50 20, 80 50, 90 50 C 80 50, 50 80, 50 90 C 50 80, 20 50, 10 50 C 20 50, 50 20, 50 10'
  },
  {
    name: 'diamond',
    path: 'M 50 10 L 80 50 L 50 90 L 20 50 Z'
  },
  {
    name: 'heart',
    path: 'M 10 40 C 10 10, 50 10, 50 30 C 50 10, 90 10, 90 40 C 90 70, 70 60, 50 90 C 30 60, 10 70, 10 40 '
  },
  {
    name: 'spade',
    path: 'M 90 50 C 90 80, 50 80, 50 60 C 50 80, 10 80, 10 50 C 10 30, 30 40, 50 10 C 70 40, 90 30, 90 60 Z M 30 90 Q 50 80 45 50, v -20 h 10 v 20, Q 50 80 70 90 Z'
  },
  {
    name: 'club',
    path: 'M 10 55 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0 ' +
          'M 50 55 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0 ' +
          'M 30 30 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0 ' +
          'M 70 90 Q 50 80 55 50, v -20 h -10 v 20, Q 50 80 30 90 Z'
  },
];
