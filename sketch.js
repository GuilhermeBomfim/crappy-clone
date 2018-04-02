  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');
  
  let largura = canvas.width = innerWidth;
  let altura = canvas.height = innerHeight;
  
  let queda = true;
  let barras = [];
  let placar = 0;
  const gravidade = 0.5;

  function random(min, max) { 
    //gerador de numero aleatorio entre os valores
    return Math.round(Math.random() * (max - min + 1) + min)
  }

  class Flappy {
    constructor() {
      this.x = Math.floor(largura / 3);
      this.y = altura / 3;
      this.raio = 15;
      this.dy = 0;
    }
    mostrar() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.raio, 0, 20);
      ctx.fillStyle = 'white'
      ctx.fill();
    }
    atualizar() {
      // controle mouse 
      window.addEventListener('mousedown', function() {
        this.dy = 0;
        this.y -= 50;
        queda = false;
      });
      window.addEventListener('mouseup', function() {
        this.dy = 0;
        queda = true;
      });
      // controle touch 
      window.addEventListener('touchstart', function() {
        this.dy = 0;
        this.y -= 50;
        queda = false;
      });
      window.addEventListener('touchend', function() {
        this.dy = 0;
        queda = true;
      });

      // gameplay
      if (this.y > (altura - this.raio)) {
        /*contador =*/
        this.dy = 0;
        this.y = (altura - this.raio);
      } else if (this.y < this.raio) {
        /*contador =*/
        this.dy = 0;
        this.y = this.raio;
      } else {
        if (queda) {
          this.dy += gravidade;
        } else {
          this.dy -= 1.1 * gravidade;
        }
      }
      this.mostrar();
      this.y += this.dy;
    }
  }

  class Obstaculo {
    constructor(x) {
      this.x = x;
      this.y = 0;
      this.largura = 2.5 * flappy.raio
      this.velocidade = 5
      this.color = 'white'
    }
    mostrar() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.largura, altura);
      ctx.fillStyle = this.color;
      ctx.fill()
    }
    atualizar() {
      this.mostrar();
      if (this.x < -this.largura) {
        this.x = largura;
        this.color = 'white'
      }
      this.x -= this.velocidade;
    }
  }

  class Espaco {
    constructor(objeto) {
      this.lugar = random(altura / 8, altura / 2)
      this.tamanho = random(0, altura / 8);
      this.x = objeto.x - 0.5;
      this.y = this.lugar - this.tamanho
      this.largura = objeto.largura;
      this.comprimento = this.lugar + this.tamanho
      this.velocidade = objeto.velocidade
      this.objeto = objeto
      this.contador = 0;
    }
    mostrar() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.largura, this.comprimento);
      ctx.fillStyle = 'black';
      ctx.fill();
      ctx.lineWidth = 10;
      ctx.stroke();
    }
    atualizar() {
      this.mostrar();
      if (this.x < -this.largura) {
        this.x = largura;
        this.lugar = random(altura / 8, altura / 2)
        this.tamanho = random(0, altura / 8);
        this.y = this.lugar - this.tamanho
        this.comprimento = this.lugar + this.tamanho
        this.contador = 0
      }
      this.x -= this.velocidade;

      if (this.x < flappy.x && flappy.x < (this.x + this.largura)) {
        if (this.y < flappy.y && flappy.y < (this.y + this.comprimento)) {
          if (this.contador === 0) {
            placar+=1
            this.contador++;
          }
        } else {
          placar = 0;
          this.objeto.color = 'red'
        }
      }
    }
  }

  //criando os objetos
  let flappy = new Flappy;
  let obstaculo1 = new Obstaculo(largura);
  let espaco1 = new Espaco(obstaculo1);
  let obstaculo2 = new Obstaculo(1.5 * largura);
  let espaco2 = new Espaco(obstaculo2);

  barras.push(obstaculo1);
  barras.push(espaco1);
  barras.push(obstaculo2);
  barras.push(espaco2);

  function Placar() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Pontos: " + placar, 8, 20);
  }

  // gameplay
  function anime() {
    requestAnimationFrame(anime);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, largura, altura);
    for (let treco of barras) {
      treco.atualizar();
    }
    flappy.atualizar();
    Placar();
  }
  anime();
