
import { Medico } from "../domain/medico";

import { MedicoRepository } from "../domain/MedicoRepository";

import { pool } from "../../../db/mysql";

export class MedicoRepositoryMySQL implements MedicoRepository {

    private medicos: Medico[] = [];

   async cadastrarMedico(medico: Medico): Promise<void> {

   try {
    
     await pool.query(
    'INSERT INTO medicos (id, name, email, cedula, telefone) VALUES (?, ?, ?, ?, ?)',
        [medico.id, medico.name, medico.email, medico.cedula, medico.telefone]
    );
   } catch (error) {
    console.error('Erro ao cadastrar Medico: ', error)

   }
}

    async listarMedicos(): Promise<Medico[]> {
    const [rows] = await pool.query('SELECT * FROM medicos');
    return (rows as any[]).map(row => new Medico(
        row.id,
        row.name,
        row.email,
        row.cedula,
        row.telefone,
        row.ativo
    ));
}

  async buscarMedicoPorEmail(email: string): Promise<Medico | null> {
    const [rows] = await pool.query('SELECT * FROM medicos WHERE email = ?', [email]);

    const results = rows as any[];

    if (results.length > 0) {
        const row = results[0];
        return new Medico(
            row.id,
            row.name,
            row.email,
            row.cedula,
            row.telefone,
            row.ativo,
        );
    }
    return null
    
}

    async deletarMedico(id: string): Promise<void> {
        
        await pool.query('DELETE FROM medicos WHERE id = ?', [id]);
    }

    async editarMedico(id: string): Promise<Medico | null> {

        const [ rows ] = await pool.query('SELECT * FROM medicos WHERE id = ?', [id]);
        if((rows as any[]).length > 0){
            const row = ( rows as any[])[0];
            return new Medico(
                row.id,
                row.name,
                row.email,
                row.cedula,
                row.telefone,
                row.ativo,
            )
        }
        return null   
    };

    async atualizarMedico(medico: Medico): Promise<Medico | null> {

        const [rows] = await pool.query('UPDATE medicos SET name = ?, email = ?, cedula = ?, telefone = ? WHERE id = ?', [medico.name, medico.email, medico.cedula, medico.telefone, medico.id]);

        return null

    }

}