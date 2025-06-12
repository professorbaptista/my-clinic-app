

export class Consulta {

    constructor(
        public id: string,
        public medico_id: string,
        public paciente_id: string,
        public data: Date,
        public tipo_consulta: string,
        public status: Boolean = true,
       
       
    ){};

}



    
    
