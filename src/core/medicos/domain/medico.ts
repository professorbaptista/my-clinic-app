
export class Medico {
    constructor (
        public id: string,
        public name: string,
        public email: string,
         public cedula: string,
        public telefone: string,
        public ativo: boolean = true,
    ){}
}