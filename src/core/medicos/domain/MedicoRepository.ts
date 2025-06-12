

import { Medico } from "./medico";

export interface MedicoRepository {

    // Definição de metodos.
    cadastrarMedico(medico: Medico): Promise<void>;

    listarMedicos(): Promise<Medico[]>;

    buscarMedicoPorEmail(email: string): Promise<Medico | null>;

    atualizarMedico(medico: Medico): Promise<Medico | null>;

    deletarMedico(id: string): Promise<void>;

    editarMedico(id: string): Promise<Medico | null>;
}



