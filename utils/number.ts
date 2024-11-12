export const round = (value: number, dec: number = 2) =>
  Number(Number(value || 0).toFixed(dec));

export const format = (value: string | number = '', dec?: number) =>
  `${dec === undefined ? value : round(Number(value), dec)}`.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ','
  );
