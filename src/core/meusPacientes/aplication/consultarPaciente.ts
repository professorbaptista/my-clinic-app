

import { MeuPaciente } from "../domain/meuPaciente";

import { MeuPacienteRepositury } from "../domain/MeuPacienteRepository";

import { v4 as uuidid } from "uuid";

export class ConsultarPaciente {
    constructor(private Repo: MeuPacienteRepositury){};

    async executar( data: {
        id: string,
        name: string,
        email: string,
        telefone: string, 
        data: Date,
        ativo: boolean,
    }) {
        const paciente = new MeuPaciente(
        uuidid(),
        data.name, 
        data.email, 
        data.telefone, 
        data.ativo, 
    
        );

        await this.Repo.listarPacienteDoMedico(paciente);
        return paciente
       
    }
}