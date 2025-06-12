/// <reference types="../../../types/express-session" />
import express from 'express';
import { Request, Response, NextFunction } from 'express';

import { CadastrarPaciente } from '../application/cadastrarPaciente';

import { PacienteRepositoryMySQL } from '../infrastrutura/PacienteRepositoryMySQL';

import { Paciente } from '../domain/Paciente';
import { Consulta } from '../../consultas/domain/Consulta';
import { ConsultaRepositoryMySQL } from '../../consultas/infrastrutura/ConsultaRepositoryMySQL';

import { Depoimento } from '../../Depoimentos/domain/Depoimento';
import { DepoimentosRepositoryMySQL } from '../../Depoimentos/infra/DepoimentoRepositoryMySQL';


const router = express.Router();

// Importando o repositório de pacienteRepoMysql.
const PacienteRepo = new PacienteRepositoryMySQL();
// Repositório compartilhado para pacientes.
const useCase = new CadastrarPaciente(PacienteRepo);
const consultaRepo = new ConsultaRepositoryMySQL();
const DepoimentoRepo = new DepoimentosRepositoryMySQL();



// Rotas // Rota home
router.get('/', (req, res) => {
    res.render('home');
});

router.get('/sobre', ( req, res ) => {
    res.render('sobre'); // Criar a pagina sobre.
});

// Rota para mostrar o formulario de login.
router.get('/login', (req, res) => {

    res.render('login', { error: null})
} );

// Pagina de depoimentos GET
router.get('/depoimento', async (req, res) => {
     
    res.render('depoimentos') //Criar a pagina de depoimentos 
});

router.post('/depoimentos', async (req, res) => {

   const { name, mensagem } = req.body;
   console.log('req.body: ', req.body);

    try {
        
           await DepoimentoRepo.salvar({  name, mensagem});
           res.redirect('/usuarios/paginaDeDepoimentos');

    } catch (error) {
        console.log('Erro ad salvar depoimento: ', error)
        res.render('depoimentos', { error: 'Erro ao salvar depoimento' })
    }
    
});

router.post('/deletar/:id', async (req, res) => {

    const id = req.params.id;
    console.log('Req.params.id: ', req.params.id)
    try {
        
        await DepoimentoRepo.deletarDepoimento(id);
         console.log('Depoimento a deletar: ', id);
        res.redirect('/usuarios/paginaDeDepoimentos')
    } catch (error) {
        
        console.error('Erro: ', error);
        res.render('depoimentos', {error: 'Erro ao deletar depoimento.'})
    }
})

router.get('/paginaDeDepoimentos', async (req, res) => {

     // Confimaçao visual ou message de confirmação.
    const success = req.query.success;
    let message = null;
    if (success) {
        message = 'Depoimento enviado com sucesso!'
    }

    // Confirmaçao visual para editar paciente
    const edit = req.query.edit;
    if (edit) {
        message = 'Depoimento editado com sucesso!';
    }

    // Deletar paciente
    const del = req.query.del;
    if (del) {
        message = 'Depoimento excluido com sucesso!'
    }

    const depoimentos = await DepoimentoRepo.listarTodosDepoimentos();
    console.log('Depoimentos: ', depoimentos);

    res.render('paginaDeDepoimentos', { depoimentos });
})

// Rota para preencher o formulario de login.
router.post('/login', async (req, res) => {
    const { email, telefone } = req.body;

    // Buscar o paciente no repositório
    const paciente = await PacienteRepo.consultarPacientePorEmail(email);

    if (paciente && paciente.telefone === telefone) {
        req.session.user = { email, telefone, tipo: 'paciente' }; // Guardar na sessão
        // console.log('Sessão após login: ', req.session.user);
        res.redirect('/usuarios/area'); // Criar a pagina de agendamento.
    } else {
        res.render('login', { error: 'credenciais inválidas. Verifique o seu email e telefone.'});
    }
});


// Rota para o logout do paciente.
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao encerrar sessão:', err);
            console.log('Paciente deslogado: ', req)
            return res.redirect('/usuarios/pacientes');
        }
        res.clearCookie('connect.sid'); // Limpa o cookie de sessão
        res.redirect('/usuarios/login');
    });
});


// Midleware para proteger as rotas.
function requireLogin(req: Request, res: Response, next: NextFunction) {
    if (req.session.user && req.session.user.tipo === 'paciente') {

        return next();
    }
        return res.status(403).render('erroPermissao', {message: 'Acesso permitido apenas para pacientes!'});
        
}

// Rota para mostrar o formulario de agendar consulta (GET)
router.get('/agendar', requireLogin, (req, res) => {
    console.log('Usuario autenticado: ', req.session.user);
    const paciente = req.session.user;
    const medico = req.session.user
    const tipo_consulta = req.session.user

    res.render('agendarConsulta',{ paciente, medico, tipo_consulta});
});

// Rota para prencher o formulario de agendar consulta (POST)
router.post('/agendar', requireLogin, async (req, res) =>{

    console.log('req.body =>', req.body)

     const {id, medico_id, paciente_id, data, hora, tipo_consulta,  status } = req.body;

     const dataCompleta = `${data} ${hora}`;

     const novaConsulta = new Consulta(
        id,
        medico_id,
        paciente_id,
        data,
        tipo_consulta,
        status || 'pendente',
     )

     try {
        // Salvar a consuta no banco de dados.
        await consultaRepo.agendarConsulta(novaConsulta);

        // Renderizando a view que mostra os dados de agendamento.
        console.log('Dados recebidos: ', req.body);
        return res.redirect('/usuarios/consultaAgendada')

     } catch (error) {
        res.render('agendarConsulta', { error: 'Erro ao agendar consulta',  message: null})
     }
});


// Rota para direcionar usuario para area de paciente.
router.get('/area', async (req, res) => {

    if (!req.session.user || req.session.user.tipo !== 'paciente') {
        return res.redirect('/usuarios/login')
    }
    res.render('areaPaciente', {paciente: req.session.user}) // Criar a view areaPaciente.
});

// Rota para exibir o formulario de cadastro
router.get('/cadastro', async (req,  res) => {
   
    // Verificar se o usuário já está logado.

    if (req.session.user) {
        return res.redirect('/usuarios/area'); // Redirecionar para agendamento se já estiver logado.
    }
      // Renderizar a página de cadastro de paciente.
    res.render('cadastroPaciente', { message: null, error: null });
});

// Rota para mostrar os pacientes cdastrados.
router.get('/pacientes', requireLogin, async (req, res) => {

    // Confimaçao visual ou message de confirmação.
    const success = req.query.success;
    let message = null;
    if (success) {
        message = 'Paciente cadastrado com sucesso!'
    }

    // Confirmaçao visual para editar paciente
    const edit = req.query.edit;
    if (edit) {
        message = 'Paciente editado com sucesso!';
    }

    // Deletar paciente
    const del = req.query.del;
    if (del) {
        message = 'Paciente excluido com sucesso!'
    }

    // Logica para busca de pacientes
    const q = req.query.q as string || '';
        
    const page = parseInt(req.query.page as string) || 1;

    const limit = 5; // 5 pacientes por pagina.
    const offset = (page - 1) * limit;

    let pacientes = await PacienteRepo.listarPacientes();
    if (q) {
    const qLower = q.toLocaleLowerCase();
    pacientes = pacientes.filter((p => 
        p.name.toLowerCase().includes(qLower) || 
        p.email.toLowerCase().includes(qLower) || 
        p.telefone.toLowerCase().includes(qLower)));
}

        const total = pacientes.length;
        const totalPages = Math.ceil(total / limit);
        const pacientesPaginados = pacientes.slice(offset, offset + limit);

    try {

        let error = null;
        if (pacientesPaginados.length === 0) {
            error = `Nenhum paciente foi encontrado com este ${q} ...`;
        }
        res.render('pacientes', { 
            pacientes: pacientesPaginados, message,
            error,
            q,
            page,
            totalPages
         });

    } catch (error) {

        res.render('pacientes', { pacientes: [], error: 'Pacientes não encontrado.' });
    }
});

// Cadastrados de pacientes.
router.post('/pacientes', async (req, res) => {

    try {
        
        const { name, email, password, telefone } = req.body;
        console.log('Dados recebidos para cadastro:', { name, email, password, telefone });

        const paciente = await useCase.executar({
            id: '', // ID será gerado pelo banco de dados
            name,
            email,
            password,
            telefone,
            status: '',
            
        });

        // Buscar todos os pacientes cadastrados
        const pacientes = await PacienteRepo.listarPacientes();

        // Renderizar a página com a lista
        res.redirect('/usuarios/pacientes?success=1');
    
    } catch (error) {
        res.render( 'cadastroPaciente', { error: 'Erro ao cadastrar paciente!' });
    }
});

// Rota para editar pacientes (GET).

router.get('/pacientes/editar/:id', async  (req, res) => {

    const id = req.params.id;

    const paciente = (await PacienteRepo.listarPacientes()).find((p => String (p.id) === String(id)));
    if (!paciente) {
        return res.render('editarPaciente', { paciente: {}, error: 'Paciente não encontrado!' })
    }
    res.render('editarPaciente', {paciente, message: null, error: null}) // Criar a pagina editar paciente.

})

// Rota para editar pacientes (POST)
router.post('/pacientes/editar', requireLogin, async (req, res) => {

    // Obter o ID do paciente a ser editado
    const { id, name, email, telefone, tipo } = req.body;
    console.log('Dados recebidos para edição:', { id, name, email, telefone, tipo });
    try {
        
        await PacienteRepo.atualizarPacientes( new Paciente (id, name, email, '', telefone, ''));
        console.log('Paciente atualizado com sucesso:', { id, name, email, telefone });
        // Redirecionar para a lista de pacientes após a edição.

        res.redirect('/usuarios/pacientes?edit=1'); // Redirecionar para a lista de pacientes após a edição.
    } catch (error) {
        res.render('editarPaciente', { paciente: { id, name, email, telefone }, message: null, error: 'Erro ao editar paciente!'})
    }

}) ;

// Rota para deletar paciente.
router.post('/delete/:id',  async (req, res) => {

    const id = req.params.id;

   try {
    
    await PacienteRepo.deletarPaciente(id);
    res.redirect('/usuarios/pacientes?del=1');
   } catch (error) {

    console.log('Paciente deletado: ', error);
    res.render('pacientes', {error: 'Erro ao deletar paciente!'})
   }
}); 

router.get('/contacto', (req, res) => {
    res.render('contacto', { message: null, error: null }) // Criar a pagina contactos
})

export default router; 
