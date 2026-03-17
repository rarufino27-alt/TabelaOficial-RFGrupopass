const DataManager = {

  rotas: [],
  indice: {},

  async carregar() {

    try {

      console.log("⬇ Carregando rotas...");

      const resposta = await fetch("./data/rotas.json?nocache=" + Date.now());

      if(!resposta.ok){
        throw new Error("Erro ao carregar rotas");
      }

      this.rotas = await resposta.json();

      console.log("✅ Rotas carregadas:", this.rotas.length);

      this.criarIndice();

    } catch(e){

      console.error("Erro ao carregar rotas:", e);

    }

  },

  criarIndice(){

    this.indice = {};

    this.rotas.forEach(r => {

      if(!this.indice[r.origem]){
        this.indice[r.origem] = {};
      }

      this.indice[r.origem][r.destino] = Number(r.valor);

      // cria também rota inversa automaticamente

      if(!this.indice[r.destino]){
        this.indice[r.destino] = {};
      }

      this.indice[r.destino][r.origem] = Number(r.valor);

    });

  },

  listarOrigens(){

    return Object.keys(this.indice).sort();

  },

  listarDestinos(origem){

    if(!this.indice[origem]) return [];

    return Object.keys(this.indice[origem]).sort();

  },

  buscarValor(origem,destino){

    if(
      this.indice[origem] &&
      this.indice[origem][destino]
    ){
      return this.indice[origem][destino];
    }

    return null;

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