export interface Config {
  nome?: string;
  alturaTotal?: number;
  localizacao?: {
    lat: number;
    lng: number;
  };
}
