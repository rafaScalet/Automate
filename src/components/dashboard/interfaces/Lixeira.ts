import type { Config } from './Config';
import type { Leitura } from './Leitura';

export interface LixeiraData {
  leituras?: {
    atual?: Leitura;
  };
  config?: Config;
}
