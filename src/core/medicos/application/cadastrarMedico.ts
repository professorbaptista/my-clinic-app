
import { Medico } from "../domain/medico";

import { MedicoRepository } from "../domain/MedicoRepository";
import { v4 as uuidid } from 'uuid';

export class CadastarMedico{
    constructor(private MedicoRepo: MedicoRepository){};

    async executar( data: {
        id?: string,
        name: string,
        email: string,
        cedula: string,
        telefone: string
    }){
        const medico = new Medico(
            uuidid(), 
            data.name,
            data.email,
            data.cedula,
            data.telefone
        )

        await this.MedicoRepo.cadastrarMedico(medico);
        const id = data.id || uuidid();
    }

}


