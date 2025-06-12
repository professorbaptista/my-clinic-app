
export class Consulta{
    constructor(
        public id: string,
        public medicoId: string,
        public pacienteId: string,
        public data: Date,
        public tipo_consulta: string,
        public estatuto: Boolean
    ){}
}