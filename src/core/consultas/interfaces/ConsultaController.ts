/// <reference types="../../../types/express-session" />

// Importar o express

import express from 'express';

// Importando as classe
import { pacienteRepoShered } from '../../../shared/PacienteRepoShered';
import { ConsultarPaciente } from '../application/consultarPaciente';

import { ConsultaRepositoryMySQL } from '../infrastrutura/ConsultaRepositoryMySQL';
import { Request, Response, NextFunction } from 'express';
import { PacienteRepositoryMySQL } from '../../usuarios/infrastrutura/PacienteRepositoryMySQL';
import { MedicoRepositoryMySQL } from '../../medicos/infrastrutura/MedicoRepositoryMySQL';

// Instanciando os repositórios
const consultaRepository = new ConsultaRepositoryMySQL();
const pacienteRepository = new PacienteRepositoryMySQL();
const medicoRepository = new MedicoRepositoryMySQL();


// Instanciar o express
const router = express.Router();

const useCase = new ConsultarPaciente(pacienteRepoShered);

// Midleware para proteção das rotas.

function requireAuth (req: Request, res: Response, next: NextFunction){

      if(!req.session.user){
        return res.redirect('/usuarios/login')
    }

    next();
}

// router.get('/consultas/agendaMedica', requireAuth, async (req, res) => {  

//     const medicoEmail = req.session.user?.email;
//     if (!medicoEmail) {
//         return res.redirect('/medicos/login');
//     }

//     const medico = await MedicoRepo.buscarMedicoPorEmail(medicoEmail)

//     console.log('Email do Medico: ', medicoEmail)
//     const consultas = await ConsultaRepo.listarConsultasDoMedicoId(medicoEmail);
//     console.log('Dados da consultas encontrados:' ,consultas)
//     res.render('paginasConsultas', { consultas, medico });
// });


// // Middleware para proteção das rotas
// function requireAuth(req: Request, res: Response, next: NextFunction) {
//   if (!req.session.user) {
//     return res.redirect('/usuarios/login');
//   }
//   next();
// }

// Rota para agenda médica 
router.get('/consultas/agendaMedica', requireAuth, async (req, res) => {
  const medicoEmail = req.session.user?.email;
  if (!medicoEmail) {
    return res.redirect('/medicos/login');
  }

  const medico = await medicoRepository.buscarMedicoPorEmail(medicoEmail);
  if (!medico) {
    // Caso o médico não seja encontrado, redireciona ou exibe erro
    return res.redirect('/medicos/login');
  }

  const consultas = await consultaRepository.listarConsultasDoMedicoId(medico.id);
  console.log('Dados das consultas encontradas:', consultas);
  res.render('paginasConsultas',  {consultas,  medico });
});

// Rota para consultar pacientes.
router.get('/relatorio', requireAuth, async (req, res) => {

    const pacientes = await pacienteRepository.listarPacientes(); 
    
    res.render('relatorioConsultas', { pacientes });
});

export default router;



