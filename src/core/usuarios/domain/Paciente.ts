
export class Paciente {

    constructor(
        
        public id: string,
        public name: string,
        public email: string,
        public password: string,
        public telefone: string,
        public tipo: string,
        public ativo: boolean = true
    ){};

    atualizar(novoNome: string, novoTelefone: string){
        this.name = novoNome,
        this.telefone  = novoTelefone
    }
}
