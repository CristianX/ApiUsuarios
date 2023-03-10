const express = require('express');
const morgan = require('morgan');
const app = express();
var cors = require("cors");
const database = require("./modulos/dbconect");
const bodyParser = require('body-parser');

// settings
app.set('port', process.env.PORT || 3002);

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//USUARIOS
app.use('/apiusuario', require('./src/ApiUsuarios/Crudusuarios'));
app.use('/apiusumicuenta', require('./src/ApiUsuarios/Usumicuenta'));
app.use('/apiusureclamo', require('./src/ApiUsuarios/UsuReclamos'));
app.use('/apiregistro', require('./src/ApiUsuarios/registro'));
app.use('/apiverificacion', require('./src/ApiUsuarios/UsuVerificacion'));

// ADMINISTRADOR
app.use('/apiadminclientes', require('./src/ApiUsuarios/AdminClientes'));
app.use('/apiadminreclamos', require('./src/ApiUsuarios/AdminReclamos'));

// starting the serve
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});