const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const api = require('./data/series.json');

app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions:{
        allowProtoMethodsByDefault: true,
        allowedProtoMethodsByDefault: true,
    }}))
app.set('view engine', 'handlebars');
app.use(express.urlencoded({extended: false}));
app.use(express.json());


function gerarListaFor(t_inicial, t_final, parametro, incluso, obj){
    for (let i = t_inicial; i >= t_final; i--) {
        if (!parametro || api[i][parametro].toLowerCase().includes(incluso.toLowerCase())) {
            if (Object.keys(obj).length < 12) {
                obj[Object.keys(obj).length] = api[i];
            }
        }
    }
}

function gerarListaWhile(genero, obj) {
    let i = api.length - 1;
    while (i >= 0 && Object.keys(obj).length < 12) {
        if (!genero || api[i].generos.includes(genero)) {
            obj[Object.keys(obj).length] = api[i];
        }
        i--;
    }
}

app.get('/', async function(req, res) {
    let lancamentos = {};
    gerarListaFor(api.length - 1, api.length - 13, null, null, lancamentos);

    let acao = {};
    gerarListaWhile("Action", acao);

    let comedias = {};
    gerarListaWhile("Comedy", comedias);

    let dramas = {};
    gerarListaWhile("Drama", dramas);

    res.render('series', {lancamentos, acao, comedias, dramas})
})

app.get('/series', function(req, res){
    let nomePesquisado = req.query.titulo
    let data = {};
    gerarListaFor(api.length - 1, 0, 'titulo', nomePesquisado, data);
    res.render('search', {data})
})

app.listen('3000', function(){
    console.log('Server ON')
})