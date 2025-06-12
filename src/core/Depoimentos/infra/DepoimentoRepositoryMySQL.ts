
import { Depoimento } from "../domain/Depoimento";

import { DepoimentosRepository } from "../domain/DepoimentoRepository";

import { pool } from "../../../db/mysql";

export class DepoimentosRepositoryMySQL implements DepoimentosRepository{

    async salvar(depoimento: Depoimento): Promise<void> {
        await pool.query('INSERT INTO depoimentos (name, mensagem) VALUES (?, ?)', [ depoimento.name, depoimento.mensagem]);
       
    }

    async listarTodosDepoimentos(): Promise<Depoimento[]> {
       
        const [ rows ]  = await pool.query('SELECT * FROM depoimentos ORDER BY id DESC');
        return (rows as any[]).map(row => new Depoimento(
            row.name,
            row.mensagem,
        ))
    }

    async deletarDepoimento(id: string): Promise<Depoimento | null>{
        await pool.query('DELELE FROM depoimentos WHERE id = ?', [id]);

        return null;
    }

    async editarDepoimento(id: string): Promise<Depoimento | null> {

        
        return null;
    }

    async buscarPorId(id: string): Promise<Depoimento | null> {
        
        const [rows] = await pool.query('SELECT * FROM depoimentos WHERE id = ?', [id]);
        return null;
    }
}

