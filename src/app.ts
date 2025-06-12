
import express from 'express';
import session from 'express-session';
import path from "path";
import consultaRouter from './core/consultas/interfaces/ConsultaController';
import usuarioRouter from './core/usuarios/interfaces/PacienteController';

import medicoRouter from './core/medicos/interfaces/MedicoController';
// import meusPacientesRouter  from './core/meusPacientes/interface/meuPacienteRoutes';
// import minhasConsultasRouter from './core/minhasConsultas/interface/consultasRoutes';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}))

// Configuraçao das sessões.
app.use(session({
  secret: 'meuSecretSuper',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false}
}));

// Midleware global para rotas protegidas.
app.use((req, res, next) =>{

  res.locals.user = req.session.user;
  next(); 
})

// Configuração de template engine com ejs
app.set('view engine', 'ejs');

// confguraçao do diretorio de views
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '../public')));


app.use('/consultas', consultaRouter);
app.use('/usuarios', usuarioRouter);
app.use('/medicos', medicoRouter);
// app.use('/', meusPacientesRouter);
// app.use('/', minhasConsultasRouter);

export default app;

