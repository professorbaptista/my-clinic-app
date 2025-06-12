
import { Consulta } from "../domain/minhaConsulta";
import { MinhaConsultaRepository } from "../domain/minhaConsultaRepository";

import { v4 as uuidid } from "uuid";

export class Consultar {
    constructor(
        private Repo: MinhaConsultaRepository
    ){};


    async executar(data: {
        id: string,
        medicoId: string,
        pacienteId: string,
        data: Date,
        tipoConsulta: string,
        estatuto: Boolean,

    }){
        const consulta = new Consulta(
            uuidid(),
            data.medicoId,
            data.pacienteId,
            data.data,
            data.tipoConsulta, 
            data.estatuto
        )
        await this.Repo.agendar(consulta);
    }
}

