
import { pool } from "../../../db/mysql";
import { MeuPacienteRepositury } from "../domain/MeuPacienteRepository";
import { MeuPaciente } from "../domain/meuPaciente";

export class MeuPacienteRepositoryMySQL implements MeuPacienteRepositury {
    private pacientes: MeuPaciente[] = [];

    async listarPacienteDoMedico(medicoId: string): Promise<MeuPaciente[]> {
        
        const [ rows ] = await pool.query('SELECT DISTINCT p.* FROM pacientes p JOIN consultas c ON p.id = c.paciente_id WHERE c.medico_id = ?', [medicoId]);

        return (rows as any[]).map(row => new MeuPaciente(
            row.id,
            row.name, 
            row.email,
            row.telefone,
            row.ativo
        ))
    }
}

