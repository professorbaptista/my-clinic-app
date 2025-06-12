
// Importações de arquivos.
/// <reference types="../../../types/express-session" />
import express, { Request, Response, NextFunction }  from "express";
import { MedicoRepositoryMySQL } from "../infrastrutura/MedicoRepositoryMySQL";
import { CadastarMedico } from "../application/cadastrarMedico";
import { Medico } from "../domain/medico";
import { ConsultaRepositoryMySQL } from "../../consultas/infrastrutura/ConsultaRepositoryMySQL";
import { Consulta } from "../../consultas/domain/Consulta";



// Instancia de express
const router = express.Router();

// Importaçao de repositorio
const MedicoRepo = new MedicoRepositoryMySQL();
// Instancia do repositorio.
const useCase = new CadastarMedico(MedicoRepo);

const ConsultaRepo = new ConsultaRepositoryMySQL();

// Função de Midleware
function requireLoginMedico( req: Request, res: Response, next: NextFunction){
    if (req.session.user && req.session.user.tipo === 'medico') {
        return  next();   
    };
    return res.status(403).render('erroPermissaoMedico', { message: 'Acesso permitido apenas para médicos!'});  
};

router.get('/medicosCadastrados', async (req, res) => { // Proteger a rota

     // Confimaçao visual ou message de confirmação.
    const success = req.query.success;
    let message = null;
    if (success) {
        message = 'Medico cadastrado com sucesso!'
    }

     // Confirmaçao visual para editar paciente
    const editar = req.query.editar;
    if (editar) {
        message = 'Médico editado com sucesso!';
    }

    // Deletar paciente
    const deletar = req.query.deletar;
    if (deletar) {
        message = 'Médico excluido com sucesso!'
    };


      // Logica para busca de medicos.
    const q = req.query.q as string || '';

    // Contagem de paginas.
    const page = parseInt(req.query.page as string) || 1;

    const limit = 5; // 5 pacientes por pagina.
    const offset = (page - 1) * limit;

    let medicos = await MedicoRepo.listarMedicos();
    if (q) {
        const qLower = q.toLocaleLowerCase();
        medicos = medicos.filter((p => 

            p.name.toLocaleLowerCase().includes(qLower) ||
            p.email.toLocaleLowerCase().includes(qLower) || 
            p.cedula.includes(qLower) || 
            p.telefone.toLocaleLowerCase().includes(qLower)

        ))
    };

        const total = medicos.length;
        const totalPages = Math.ceil(total / limit);
        const medicosPaginados = medicos.slice(offset, offset + limit);


        try {

        let error = null;
        if (medicosPaginados.length === 0) {
            error = `Nenhum paciente foi encontrado com este ${q} ...`;
        }
        res.render('medicosCadastrados', { 
            medicos: medicosPaginados, message,
            error,
            q,
            page,
            totalPages
         });

    } catch (error) {

         res.render('medicosCadastrados', {message: null, error: null}) // Criar a pagina medicos.
    }

});

router.post('/medicosCadastrados', requireLoginMedico, async (req, res) =>{

    const { name, email, cedula, telefone} = req.body;

    try {
        
    const medico = await useCase.executar({
        id: '',
        name,
        email,
        cedula,
        telefone
    }); 

    const medicos = await MedicoRepo.listarMedicos();
    res.redirect('/medicos/medicosCadastrados');
    } catch (error) {
        res.render('cadastroMediico', {message: null, error: null})
    }
})


router.get('/cadastro', async (req, res) => {

    res.render('cadastroMedico', { message: null, error: 'Erro ao cadastrar médico!'})

});

// Rota para preencher o formulario de medicos.
router.post('/cadastro', async (req, res) => {
   
    try {
        
        const { name, email, cedula, telefone } = req.body;

        console.log('medico cadstrado com sucesso: ', {name, email, cedula, telefone})

        const medico = await useCase.executar({
            name,
            email,
            cedula, 
            telefone,   
        });

        res.redirect('/medicos/medicosCadastrados?success=1');

    } catch (error) {

        console.error('Erro ao cadastrar médico: ', error)

        res.render('cadastroMedico', { error: 'Erro ao cadastrar medico!'})   
    }
});


// Rota para mostrar o formulario de login de medicos.
router.get('/login', async (req, res) => {

    res.render('loginMedico', { error: null, message: null})
});

// Rota para preencher o formulário de login de medico.
router.post('/login', async (req, res) => { 
    // proteger a rota.

     const {  email, telefone } = req.body;

     try {
        
       console.log('dados do login recedos: ', {email, telefone, tipo: 'medico'})

        const medico = await MedicoRepo.buscarMedicoPorEmail(email);

        if (medico && medico.telefone === telefone) {
             req.session.user = { email, telefone, tipo: 'medico' };
              console.log('medico logado: ', { email, telefone, tipo: 'medico'})

              return res.redirect('/medicos/areaMedica');
        } else {
            return res.render('loginMedico', { error: 'crendeciais invalidas...'})
        }

    } catch (error) {

        console.error('Erro ao logar médico: ', error)

        return res.render('logiMedico', { error: 'erro ao realizar login...'})   
    }   
})


router.get('/areaMedica', async (req, res) => {

    if (!req.session.user || req.session.user.tipo !== 'medico') {
        return res.redirect('medicos/loginMedico')
    }
    res.render('areaMedica', {medico: req.session.user}) // Criar a view areaMedica.
});

router.get('/medicosCadastrados/editar/:id', async (req, res) => {

    const id = req.params.id;
 
    const medico = (await MedicoRepo.listarMedicos()).find((m) => String (m.id) === String(id) );
    if (!medico) {
       
        return res.status(404).render('Medico não editado...')
    }

    res.render('editarMedico', { medico, message: null, error: null});

});

router.post('/medicosCadastrados/editar/:id', async (req, res) => {
    const { name, email, cedula, telefone} = req.body;

    const id = req.params.id;

    try {
        
        await MedicoRepo.atualizarMedico( new Medico (
            id, 
            name, 
            email, 
            cedula, 
            telefone));

            console.log('Medico atualizado com sucesso: ', { name, email, cedula, telefone});

            return res.redirect('/medicos/medicosCadastrados?editar=1');

    } catch (error) {

        return res.render('editarMedico', { id, message: null, error: 'Erro ao editar o médico!' })
    }

});

router.post('/medicosCadastrados/deletar/:id', async (req, res) => {

    const id = req.params.id;

    try {
         
        await MedicoRepo.deletarMedico(id);
        console.log('Medico deletado com sucesso!', {id})
        res.redirect('/medicos/medicosCadastrados?deletar=1')
    } catch (error) {
        console.error('Problema: ', error)
        res.redirect('/medicos/medicosCadastrados?deletar=0')
    }
});

router.get('/agendaMedica', async (req, res) => {
  const medicoEmail = req.session.user?.email;
  if (!medicoEmail) {
    return res.redirect('/medicos/login');
  }

  const medico = await MedicoRepo.buscarMedicoPorEmail(medicoEmail);
  if (!medico) {
    // Caso o médico não seja encontrado, redireciona ou exibe erro
    return res.redirect('/medicos/login');
  }

  const consultasTeste = [
  { paciente_id: 1, data: new Date(), tipo_consulta: 'Consulta Geral', estatuto: true },
  { paciente_id: 2, data: new Date(), tipo_consulta: 'Retorno', estatuto: false }
];

  const consultas = await ConsultaRepo.listarConsultasDoMedicoId(medico.id);
  console.log('Dados das consultas encontradas:', consultas);
  res.render('paginasConsultas',  { consultas, medico });
}); 


router.get('/meuspacientes', requireLoginMedico, async (req, res) => {
    const pacientes = req.session.user

    res.render('meusPacientes', { pacientes });

})

export default router;
