export interface DataBlock {
  options: Options;
  original: string;
  translation: string;
}

export interface DataRow {
  number: number;
  original: string;
  translation: string;
}

export interface Options {
  source?: string;
  target?: string;
}
