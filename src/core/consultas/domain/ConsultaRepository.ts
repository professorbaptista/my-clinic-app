
// The TypeScript configuration file used in this project is : tsconfig.json
import { Consulta } from "./Consulta";

// Interface ConsultaRepository
export interface ConsultaRepository {
  agendarConsulta(consulta: Consulta): Promise<void>;

  listarConsultasDoMedicoId(medicoId: string): Promise<Consulta[]>;
  
  listarTodasConsultas(): Promise<Consulta[]>;
  // outros métodos se necessário
}