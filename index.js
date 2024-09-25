const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const api = require('./data/series.json');
const tamanho_api = api.length;

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
            if (Object.keys(obj).length < 250) { ///controle de paginaçao
                obj[Object.keys(obj).length] = api[i];
            }
        }
    }
}

function gerarListaWhile(genero, obj, limite) {
    let i = tamanho_api - 1;
    while (i >= 0 && Object.keys(obj).length <= limite) {
        if (!genero || api[i].generos.includes(genero)) {
            obj[Object.keys(obj).length] = api[i];
        }
        i--;
    }
}

app.get('/', async function(req, res) {
    let lancamentos = {};
    gerarListaFor(tamanho_api-1, tamanho_api-12, null, null, lancamentos);

    let acao = {};
    gerarListaWhile("Action", acao, 11);

    let comedias = {};
    gerarListaWhile("Comedy", comedias, 11);

    let dramas = {};
    gerarListaWhile("Drama", dramas, 11);

    res.render('series', {lancamentos, acao, comedias, dramas})
})

app.get('/series', function(req, res){
    let nomePesquisado = req.query.titulo
    let data = {};
    gerarListaFor(tamanho_api- 1, 0, 'titulo', nomePesquisado, data);
    res.render('search', {data})
})

app.get('/series/:titulo', function(req, res){
    let seriespot = {};
    let i = 0;
    let titulo = req.params.titulo;
    while(api[i].titulo != titulo && i<= tamanho_api-1){
        i++
    }
    seriespot = api[i]
    console.log(seriespot)
    res.render('solo', {seriespot: [seriespot]})
})

app.get('/action', function(req, res){
    let data = {};
    gerarListaWhile("Action", data, tamanho_api);
    res.render('search', {data})
})

app.get('/comedy', function(req, res){
    let data = {};
    gerarListaWhile("Comedy", data, tamanho_api);
    res.render('search', {data})
})

app.get('/drama', function(req, res){
    let data = {};
    gerarListaWhile("Drama", data, tamanho_api);
    res.render('search', {data})
})

app.listen('8081', function(){
    console.log('Site de Séries NO AR!')
})