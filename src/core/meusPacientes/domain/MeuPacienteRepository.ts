
import { MeuPaciente } from "./meuPaciente";

export interface MeuPacienteRepositury {

    // Listar os metodos de escalar pacientes aos medicos.
    listarPacienteDoMedico(medicoId: string): Promise<MeuPaciente[]>;
}