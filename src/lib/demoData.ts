import { Profile } from '../types';

export const demoProfiles: Record<string, Profile> = {
  'admin@cei.com': {
    id: 'admin-demo',
    nome: 'Administrador CEI',
    email: 'admin@cei.com',
    role: 'admin',
  },
  'cliente@cei.com': {
    id: 'cliente-demo',
    nome: 'Cliente Demo',
    email: 'cliente@cei.com',
    role: 'cliente',
  },
};
