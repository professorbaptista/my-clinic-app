
import { Depoimento } from "../domain/Depoimento";

import { DepoimentosRepository } from "../domain/DepoimentoRepository";

import { v4 as uuidid } from "uuid";

export class FazerDepoimento{
    constructor(private Repo: DepoimentosRepository){};

    async executar( data: {
        id: string,
        name: string, 
        mensagem: string
    }){
        const novoDepoimento = new Depoimento( 
            data.name,
            data.mensagem
        )

        await this.Repo.listarTodosDepoimentos();
    }

    
}