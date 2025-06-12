import { Depoimento } from "./Depoimento";

export interface DepoimentosRepository{

    salvar(depoimento: Depoimento): Promise<void>;

    listarTodosDepoimentos(): Promise<Depoimento[]>;

    deletarDepoimento(id: string): Promise<Depoimento | null>;

    editarDepoimento(id: string): Promise<Depoimento | null>;

    buscarPorId(id: string): Promise<Depoimento | null>;

}