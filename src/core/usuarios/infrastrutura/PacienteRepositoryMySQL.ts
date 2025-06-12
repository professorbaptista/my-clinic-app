
import { pool } from '../../../db/mysql';

import { Paciente } from '../domain/Paciente';

import { PacienteRepository } from '../domain/PacienteRepository';
import { Consulta } from '../../consultas/domain/Consulta';

export class PacienteRepositoryMySQL implements PacienteRepository {

    // Metodo para deletar paciente.
    async deletarPaciente(id: string): Promise<void> {
       await pool.query('DELETE FROM pacientes WHERE id = ?', [id])
    };

    // Metodo para edutar paciente.
    async editarPaciente(id: string): Promise<Paciente | null> {
    const [rows] = await pool.query('SELECT * FROM pacientes WHERE id = ?', [id]);
    if ((rows as any[]).length > 0) {
        const row = (rows as any[])[0];
        return new Paciente(
            row.id,
            row.name,
            row.email,
            row.password,
            row.telefone,
            row.ativo,
            row.tipo
        );
    }
    return null;
}

    // Metodo para listar pacientes.
    async listarPacientes(): Promise<Paciente[]> {
        const [rows] = await pool.query('SELECT * FROM pacientes');
        return (rows as any[]).map(row => new Paciente(
            row.id,
            row.name,
            row.email,
            row.password,
            row.telefone,
            row.tipo
        ));
    }
    // Metodo para atualizar pacientes.

    async atualizarPacientes(paciente: Paciente): Promise<Paciente | null> {
        await pool.query(
            'UPDATE pacientes SET name = ?, email = ?, telefone = ?, tipo = ? WHERE id = ?',
            [paciente.name, paciente.email, paciente.telefone, paciente.tipo, paciente.id]
        );

         console.log('Paciente atualizado: ', paciente)
        return paciente;
       
    }
    // Metodo para deletar pacientes.

    async consultarPacientePorEmail(email: string): Promise<Paciente | null> {
     
        const [rows] = await pool.query('SELECT * FROM pacientes WHERE email = ?', [email]);

        if ((rows as any[]).length > 0) {
            const row = (rows as any[])[0];
            return new Paciente(
                  row.id,
                  row.name,
                  row.email,
                  row.password,
                  row.telefone,
                  row.tipo
            );
        }
        return null;
    }

    // Metodos // Metodo para cadastrar paciente.
    async cadastrarPaciente(paciente: Paciente): Promise<void> {
        
        try {
          
          await pool.query(
            'INSERT INTO pacientes (name, email, password, telefone, ativo) VALUES (?, ?, ?, ?, ?)',
            [
        
              paciente.name, paciente.email, paciente.password, paciente.telefone, paciente.ativo]
        );
        console.log('Conectado ao banco de dados MySQL.');
        } catch (error) {
          console.error('Erro ao conectar ao banco: ', error);
        }
    };

    // Metodo para listar historico de pacientes.
    async  listarConsultasPorEmail(email: string): Promise<Consulta[]>{

        const [ rows ] = await pool.query('SELECT * FROM consultas WHERE paciente_id = ?', [email]);
        return ( rows as any[]).map(row => new Consulta(row.id, row.medico_id, row.paciente_id, row.data, row.tipo_consulta ));
     };

     async listarTodasConsultas(): Promise<Consulta[]> {
         return []
     }

      async agendarConsulta(consulta: Consulta): Promise<void> {
        await pool.query( 'INSERT INTO consultas (medico_id, paciente_id, data, tipo_consulta, estatuto) VALUES (?, ?, ?, ?, ?)', [consulta.medico_id, consulta.paciente_id, consulta.data, consulta.tipo_consulta, consulta.status]
        );
    }

}

