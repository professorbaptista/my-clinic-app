
/// <reference types="../../../types/express-session" />
import express from 'express';
import { Request, Response, NextFunction } from 'express';


import { MeuPacienteRepositoryMySQL } from '../infra/meuPacienteRepositoryMySQL';
import { ConsultarPaciente } from '../aplication/consultarPaciente';

const router = express();

const MeuPacienteRepo = new MeuPacienteRepositoryMySQL();

const useCase = new ConsultarPaciente(MeuPacienteRepo);

function requireLoginMedico (req: Request, res: Response, next: NextFunction){
     if (req.session.user && req.session.user.tipo === 'paciente') {

        return next();
    }

      return res.status(403).render('erroPermissao', {message: 'Acesso permitido apenas para pacientes!'});
}
// Definição de rota
router.post('/medicos/meusPacientes', async (req, res) => {

    const medicoId = req.session.user?.email;

    if (!medicoId) {
        return res.redirect('/medicos/login');
    }

     const pacientes = await MeuPacienteRepo.listarPacienteDoMedico(medicoId);

     res.render('meuspacientes', { pacientes, error: null, nessage: null})
   
})

router.get('/medicos/meusPacientes', async (req, res) => {
    const medicoId = req.session.user;
    if (!medicoId) {
        return res.redirect('/medicos/login');
    }

    const pacientes = await MeuPacienteRepo.listarPacienteDoMedico(medicoId);


    res.render('meusPacientes', {pacientes})
})

export default router;
