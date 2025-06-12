
import express from 'express';

import { MinhaConsultaRepositoryMySQL } from '../infra/minhaConsultaRepositoryMySQL';
import { MedicoRepositoryMySQL } from '../../medicos/infrastrutura/MedicoRepositoryMySQL';
import { Consultar } from '../aplication/consultarPaciente';

const router = express();

const minhaConsultaRepo = new MinhaConsultaRepositoryMySQL();

const MedicoRepo = new MedicoRepositoryMySQL();

const useCase = new Consultar(minhaConsultaRepo);

// Rota de consulta de paciente.
// router.post('/agendaMedica', async (req, res) => {

//     const { id, medico_id, paciente_id, data, tipo_consulta, estatuto } = req.body;

//     const novaConsulta = new Consulta(
//         id,
//         medico_id,
//         paciente_id,
//         data,
//         tipo_consulta,
//         estatuto
//     );

//     try {
        
//         await minhaConsultaRepo.agendar(novaConsulta)

//         res.redirect('/minhaAgenda');
//     } catch (error) {
//         console.error('Erro aoa agendar', error)
//         res.render('minhaAgenda', { error: 'Erro ao agendar'})
//     }
// });

// router.get('/agendaMedica', async (req, res) => {

//     const medicoEmail = req.session.user?.email;

//       if (!medicoEmail) {
//         return res.redirect('/medicos/login')
//     };


//     const medico = await MedicoRepo.buscarMedicoPorEmail(medicoEmail)
   
//     if (!medico) {

//          console.log('Dado do medico recebido: ', medico)

//         return res.redirect('/medicos/login')
//     };

//     const consultas = await minhaConsultaRepo.listarConsultaPorMedicoId(medico.id)
//     console.log(consultas)

//     res.render('agendaMedica', { consultas })
// });

export default router;    
