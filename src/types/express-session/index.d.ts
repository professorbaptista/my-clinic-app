import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: { 
      email: string; 
      telefone: string;
      tipo: 'paciente' | 'medico';
    };
  }
}