
import { Consulta } from "../../consultas/domain/Consulta";

import { Paciente } from "./Paciente";

export interface PacienteRepository {

    cadastrarPaciente(paciente: Paciente): Promise<void>;
 
    listarPacientes(): Promise<Paciente[]>;

    agendarConsulta(consulta: Consulta): Promise<void>;

    atualizarPacientes(paciente: Paciente): Promise<Paciente | null>;

    consultarPacientePorEmail(email: string): Promise<Paciente | null>;

    deletarPaciente(id: string): Promise<void>;

    editarPaciente(id: string): Promise<Paciente | null>;

    listarConsultasPorEmail(email: string): Promise<Consulta[]>;

    listarTodasConsultas(): Promise<Consulta[]>;

}