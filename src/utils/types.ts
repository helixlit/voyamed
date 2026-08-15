export type Article = {
  pzn: string;
  name: string;
  active: boolean;
  price: number;
  prescription?: boolean;
}

export enum BundelType {
  Desert,
  Mountain,
  ColdClimate,
}