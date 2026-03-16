const DataManager = {

rotas: [],

CACHE_KEY: "rf_rotas_cache",
CACHE_TIME_KEY: "rf_rotas_cache_time",

CACHE_VALIDITY: 24 * 60 * 60 * 1000,

arquivos: [

"./data/condominio-porto-do-cabo.json",
"./data/gaibu.json",
"./data/shopping-costinha.json",
"./data/enseadas.json",
"./data/setor-4.json",
"./data/xareu.json",
"./data/itapuama.json",
"./data/calhetas.json",
"./data/lote-garapu2-lote-dona-amara.json",
"./data/cohab.json",
"./data/centro-do-cabo.json",
"./data/aguia-american-club-br-101.json",
"./data/empresas.json",
"./data/engenhos.json",
"./data/interurbanas.json",
"./data/interestaduais.json",
"./data/lazer-festa.json",
"./data/locais.json",
"./data/longas-locais.json",
"./data/praias.json",
"./data/bairro-baixo.json"

],

async carregar(){

try{

const cache = localStorage.getItem(this.CACHE_KEY);
const cacheTime = localStorage.getItem(this.CACHE_TIME_KEY);

const agora = Date.now();

if(cache && cacheTime && (agora - cacheTime) < this.CACHE_VALIDITY){

this.rotas = JSON.parse(cache);

console.log("⚡ Rotas carregadas do CACHE:", this.rotas.length);

return;

}

console.log("⬇ Carregando arquivos de rotas...");

const respostas = await Promise.allSettled(

this.arquivos.map(a => this.carregarJSON(a))

);

let rotasTemp = [];

respostas.forEach((res, i)=>{

if(res.status === "fulfilled"){

rotasTemp = rotasTemp.concat(res.value);

}else{

console.warn("⚠ Falha ao carregar:", this.arquivos[i]);

}

});

this.rotas = rotasTemp;

localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.rotas));
localStorage.setItem(this.CACHE_TIME_KEY, Date.now());

console.log("✅ Rotas carregadas:", this.rotas.length);

}catch(e){

console.error("❌ Erro geral ao carregar rotas:", e);

throw e;

}

},

async carregarJSON(caminho){

return new Promise((resolve,reject)=>{

const xhr = new XMLHttpRequest();

xhr.open("GET", caminho, true);

xhr.onreadystatechange = function(){

if(xhr.readyState === 4){

if(xhr.status === 200 || xhr.status === 0){

try{

const json = JSON.parse(xhr.responseText);

resolve(json);

}catch(e){

reject("JSON inválido: " + caminho);

}

}else{

reject("Erro HTTP: " + caminho);

}

}

};

xhr.onerror = ()=> reject("Erro de rede: " + caminho);

xhr.send();

});

},

listarOrigens(){

const locais = new Set();

this.rotas.forEach(r=>{

locais.add(r.origem);
locais.add(r.destino);

});

return [...locais].sort();

},

listarDestinos(local){

const destinos = new Set();

this.rotas.forEach(r=>{

if(r.origem === local){

destinos.add(r.destino);

}

if(r.destino === local){

destinos.add(r.origem);

}

});

return [...destinos].sort();

},

buscarValor(origem,destino){

let rota = this.rotas.find(

r => r.origem === origem && r.destino === destino

);

if(!rota){

rota = this.rotas.find(

r => r.origem === destino && r.destino === origem

);

}

return rota ? Number(rota.valor) : null;

},

calcularValorCompleto(origem,parada,destino){

if(!origem || !destino) return null;

if(!parada){

return this.buscarValor(origem,destino);

}

const trecho1 = this.buscarValor(origem,parada);
const trecho2 = this.buscarValor(parada,destino);

if(trecho1 === null || trecho2 === null) return null;

return trecho1 + trecho2;

}

};