export interface Line {
  name: string;
  thickness: number;
}

export const LINES: Line[] = [
  {
    name: 'regular',
    thickness: 1,
  },
  {
    name: 'bold',
    thickness: 2,
  },
];
