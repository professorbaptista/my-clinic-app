
import { ConsultaRepositoryMySQL } from "../core/consultas/infrastrutura/ConsultaRepositoryMySQL";

const pacienteRepo = new ConsultaRepositoryMySQL();

export const pacienteRepoShered = pacienteRepo

