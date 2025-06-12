
import { Consulta } from "./minhaConsulta";

export interface MinhaConsultaRepository{

    agendar(consulta: Consulta): Promise<void>;

    listarPorMedicoId(medicoId: string): Promise<Consulta[]>;
    

    buscarMedicoPorEmail(email: string): Promise<Consulta | null>;

    // listarPorPaciente(pacienteId: string): Promise<Consulta[]>;

    cancelar(pacienteId: string): Promise<void>

   
}