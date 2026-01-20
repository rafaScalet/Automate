export interface Config {
  nome?: string;
  alturaTotal?: number;
  alturaTampa?: number;
  localizacao?: {
    lat: number;
    lng: number;
  };
}
