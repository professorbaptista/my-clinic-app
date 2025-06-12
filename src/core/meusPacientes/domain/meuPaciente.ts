
export class MeuPaciente{
    constructor (
        public id: string,
        public name: string,
        public email: string,
        public telefone: string,
        public ativo: Boolean = true
    ){}
}