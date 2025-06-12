
import { Paciente } from "../domain/Paciente";

import { PacienteRepository } from "../domain/PacienteRepository";
import { v4 as uuidid } from 'uuid';


export class CadastrarPaciente{

    constructor(private Repo: PacienteRepository){}

    async executar( data: {

        id: string, // O ID será gerado pelo banco de dados
        name: string,
        email: string,
        password: string,
        telefone: string,
        status: string
    }){
        const paciente = new Paciente(uuidid(), 
        data.name, 
        data.email, 
        data.password,
        data.telefone,
        '',
     )
        
        await this.Repo.cadastrarPaciente(paciente);
        return paciente;
    }

};



