
import { Consulta } from '../domain/Consulta';
import { ConsultaRepository } from '../domain/ConsultaRepository';

import { pool } from '../../../db/mysql';

export class ConsultaRepositoryMySQL implements ConsultaRepository {


    async agendarConsulta(consulta: Consulta): Promise<void> {


        await pool.query( 'INSERT INTO consultas (medico_id, paciente_id, data, tipo_consulta, status) VALUES (?, ?, ?, ?, ?)', [consulta.medico_id, consulta.paciente_id, consulta.data, consulta.tipo_consulta, consulta.status]
        );
    }

  // Método para listar consultas de um médico específico
  async listarConsultasDoMedicoId(medicoId: string): Promise<Consulta[]> {
    const [rows] = await pool.query(
      'SELECT c.*, p.name AS paciente_name FROM consultas c JOIN pacientes p ON p.id = c.paciente_id WHERE c.medico_id = ? ORDER BY c.data ASC',
      [medicoId]
    );
    return (rows as any[]).map(row =>
      new Consulta(
        row.id,
        row.medico_id,
        row.paciente_id,
        row.data,
        row.tipo_consulta,
        row.status
      )
    );
  }

    async listarTodasConsultas(): Promise<Consulta[]> {
        const [rows] = await pool.query('SELECT * FROM consultas');
        return (rows as any[]).map(row => new Consulta(
            row.id, row.medico_id, row.paciente_id, row.data, row.tipo_consulta, row.status 
        ));
    }
}


