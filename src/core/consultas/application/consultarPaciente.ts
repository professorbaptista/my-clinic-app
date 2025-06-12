

import { ConsultaRepository } from "../domain/ConsultaRepository";

import { v4 as uuidid } from "uuid";

export class ConsultarPaciente{

    constructor(private Repo: ConsultaRepository){}

    async executar (email: string, telefone: string){
        // Verifica se o email e telefone foram informados
        if (!email || !telefone) {
            throw new Error('Email ou telefone devem ser informados!')
        }

        return null;
   
    }
}