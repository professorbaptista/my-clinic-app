
import { pool } from "../../../db/mysql";
import { Consulta } from "../domain/minhaConsulta";
import { MinhaConsultaRepository } from "../domain/minhaConsultaRepository";

export class MinhaConsultaRepositoryMySQL implements MinhaConsultaRepository {

    private consultas: Consulta[] = [];

    async agendar(c: Consulta): Promise<void> {
        await pool.query('INSERT INTO consultas(medico_id, paciente_id, data, tipo_consulta, status) VALUES (?, ?, ?, ?, ?)', [c.medicoId, c.pacienteId, c.data, c.tipo_consulta, c.estatuto])
    };

    async listarPorMedicoId(medicoId: string): Promise<Consulta[]> {

        const [ rows ] = await pool.query('SELECT consultas.*, pacientes.name as paciente_name FROM consultas JOIN pacientes ON pacientes.id = consultas. paciente_id WHERE consultas.medico_id = ?', [medicoId]);
        return rows as Consulta[];   
    
    };

    async buscarMedicoPorEmail(medico_id: string): Promise<Consulta | null> {
        
        const medicoEmail = await pool.query('SELECT * FROM consultas WHERE medico_id = ?', [medico_id]);
        return null 
    }

    async cancelar(pacienteId: string): Promise<void> {
        await pool.query('DELETE FORM consultas WHERE pacienteId = ?', [pacienteId]);
    }

}