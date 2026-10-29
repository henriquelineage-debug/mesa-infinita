/* ============================================================
   Nomes, epítetos, tavernas e topônimos
   ============================================================ */

export const NAME_POOLS = {
  humano: {
    first: [
      'Aldric', 'Berenice', 'Cássio', 'Dália', 'Eduardo', 'Fiora', 'Gaspard', 'Helena',
      'Ivo', 'Joana', 'Lázaro', 'Mira', 'Nuno', 'Olívia', 'Quim', 'Rosa',
      'Salvador', 'Teresa', 'Ulisses', 'Vera', 'Anselmo', 'Beatriz', 'Corvo', 'Dinis',
      'Estêvão', 'Filipa', 'Gil', 'Inês', 'Júlia', 'Leandro', 'Madalena', 'Tomás',
    ],
    last: [
      'de Varga', 'Corvelo', 'Amarante', 'Duarte', 'Ferrão', 'Guedes', 'Lousada', 'Mendonça',
      'Neves', 'Ourique', 'Pestana', 'Queiroz', 'Ribeiro', 'Salgado', 'Tavares', 'Valadares',
      'do Couto', 'Fonseca', 'Barreto', 'Souto', 'Almeida', 'Cardoso', 'Vilar', 'Braga',
    ],
  },
  anao: {
    first: [
      'Durgan', 'Brunhild', 'Thrain', 'Vondal', 'Hilda', 'Korgan', 'Dagmar', 'Borin',
      'Grimm', 'Vala', 'Orsik', 'Helga', 'Torbek', 'Runa', 'Baldur', 'Fenna',
    ],
    last: [
      'Barba-de-Ferro', 'Punho-de-Marte', 'Cascalho', 'Veio-Fundo', 'Forno-Eterno', 'Malho',
      'Pedra-Rija', 'Cinzel', 'Braza-Fria', 'Bigorna-Oca', 'Muralha', 'Cobre-Vivo',
    ],
  },
  elfo: {
    first: [
      'Aelith', 'Caelen', 'Elowen', 'Faelar', 'Ithil', 'Lirael', 'Nael', 'Silwen',
      'Thalion', 'Vaelis', 'Aerith', 'Caladrel', 'Elira', 'Fenwen', 'Iriandel', 'Lorwyn',
    ],
    last: [
      'Folha-Prata', 'do Crepúsculo', 'Estrela-Alta', 'Véu-de-Névoa', 'Canto-Longo',
      'Ramo-Claro', 'Orvalho-Eterno', 'Sombra-Verde', 'Luz-Tardia', 'Raiz-Antiga',
    ],
  },
  pequenino: {
    first: [
      'Bilo', 'Cora', 'Dandin', 'Fennel', 'Ivo', 'Lila', 'Milo', 'Nira',
      'Pipo', 'Tansy', 'Bram', 'Dora', 'Filo', 'Merry', 'Nedo', 'Pipa',
    ],
    last: [
      'Cevada', 'Pé-Leve', 'Touceira', 'Bolo-Fofo', 'Riacho', 'Fundo-de-Bolso',
      'Colheita', 'Sete-Pães', 'Mata-Baixa', 'Gota-de-Mel', 'Beira-Porta', 'Semente',
    ],
  },
  orc: {
    first: [
      'Grok', 'Urza', 'Thokk', 'Mogra', 'Drak', 'Kharu', 'Nessa', 'Vorga',
      'Ghorza', 'Ruk', 'Sarna', 'Torga', 'Ushka', 'Vrak', 'Zug', 'Marn',
    ],
    last: [
      'Presa-Rubra', 'da Tempestade', 'Sangue-de-Pedra', 'Trovão-Negro', 'Cicatriz-Profunda',
      'Osso-Largo', 'Passo-Pesado', 'Grito-Alto', 'Couro-Cru', 'Mão-de-Ferro',
    ],
  },
  veu: {
    first: [
      'Ash', 'Corvin', 'Letha', 'Malachai', 'Nox', 'Sabra', 'Vex', 'Ysolde',
      'Damien', 'Enyra', 'Kael', 'Lilith', 'Mordecai', 'Nera', 'Silas', 'Vesper',
    ],
    last: [
      'do Pacto', 'Meia-Noite', 'Cinza-Fria', 'do Sussurro', 'Chifre-Torto',
      'Vela-Negra', 'Segundo-Nome', 'Fundo-do-Poço', 'Marca-Vermelha', 'Sem-Sombra',
    ],
  },
  silfide: {
    first: [
      'Briza', 'Flori', 'Junco', 'Lume', 'Musgo', 'Orvalho', 'Pétala', 'Zirro',
      'Avelã', 'Cílio', 'Dente-de-Leão', 'Faísca', 'Gota', 'Névoa', 'Semente', 'Vime',
    ],
    last: [
      'do Orvalho', 'Asa-Fina', 'Folha-Alta', 'Casca-Leve', 'Canto-Baixo',
      'Pó-de-Lua', 'Raiz-Solta', 'Vento-Bom', 'Colo-de-Musgo', 'Três-Sementes',
    ],
  },
  gigante: {
    first: [
      'Bjorn', 'Dagna', 'Eirik', 'Greta', 'Halvar', 'Runa', 'Sigrid', 'Torvald',
      'Astrid', 'Bragi', 'Frey', 'Hakon', 'Liv', 'Skadi', 'Ulf', 'Yrsa',
    ],
    last: [
      'Punho-de-Montanha', 'do Gelo', 'Ossada', 'Cume-Alto', 'Nevasca',
      'Pedra-Erguida', 'Trovão-Lento', 'Couro-de-Urso', 'Vento-Frio', 'Trilha-Larga',
    ],
  },
};

export const EPITHETS = [
  'o Errante', 'a Mão Fria', 'o Sem-Nome', 'Guarda-Cinzas', 'a Voz de Vidro',
  'o Que Volta', 'da Última Ponte', 'o Devedor', 'a Lâmina Mansa', 'o Sete-Vezes',
  'da Estrada Longa', 'o Olho Aberto', 'a Sombra Curta', 'o Filho da Chuva',
  'da Casa Vazia', 'o Amigo dos Cães', 'a Mão Que Dá', 'o Que Escuta Portas',
  'do Punho Fechado', 'a Testemunha', 'o Sal da Terra', 'da Vela Acesa',
  'o Primeiro a Correr', 'o Último a Dormir', 'da Cicatriz Limpa', 'o Come-Poeira',
  'a Língua Solta', 'o Guarda-Livros', 'do Dente Quebrado', 'o Bem-Aventurado',
];

export const TAVERN_PREFIX = [
  'O Corvo', 'O Caldeirão', 'A Última Vela', 'O Javali', 'A Ponte', 'O Sino',
  'As Três Chaves', 'O Sal', 'A Raposa', 'O Poço', 'A Coroa', 'O Gato',
  'A Lâmpada', 'O Machado', 'A Taça', 'O Veado', 'A Sereia', 'O Cão',
  'A Âncora', 'O Relógio', 'A Máscara', 'O Tambor', 'A Foice', 'O Espelho',
];

export const TAVERN_NAMES = [
  'O Corvo Cego', 'O Caldeirão Rachado', 'A Última Vela', 'O Javali Manco',
  'A Ponte Partida', 'O Sino Mudo', 'As Três Chaves', 'O Sal Amargo',
  'A Raposa Dourada', 'O Poço Fundo', 'A Coroa Virada', 'O Gato de Ferro',
  'A Lâmpada Torta', 'O Machado Quebrado', 'A Taça Vazia', 'O Veado Branco',
  'A Sereia Surda', 'O Cão Sonolento', 'A Âncora de Prata', 'O Relógio Parado',
  'A Máscara de Vidro', 'O Tambor Trovejante', 'A Foice Silenciosa', 'O Espelho Rachado',
  'A Porta Verde', 'O Dente de Ouro', 'A Cama de Palha', 'O Vinho Torto',
  'A Mão Aberta', 'O Passo Falso', 'A Vela Acesa', 'O Cálice de Estanho',
];

export const TAVERN_SUFFIX = [
  'Cego', 'Rachado', 'Manco', 'Partido', 'Mudo', 'Amargo', 'Dourado', 'Fundo',
  'Virado', 'de Ferro', 'Torto', 'Quebrado', 'Aceso', 'Vazio', 'de Prata',
  'Sonolento', 'Faminto', 'de Vidro', 'Trovejante', 'Silencioso', 'de Barro', 'Sem Nome',
];

export const PLACE_PREFIX = [
  'Vale', 'Porto', 'Monte', 'Bosque', 'Pântano', 'Campo', 'Pico', 'Lago',
  'Desfiladeiro', 'Ruína', 'Fonte', 'Passo', 'Ilha', 'Muralha', 'Cripta', 'Feira',
];

export const PLACE_SUFFIX = [
  'das Cinzas', 'do Corvo', 'de Sal', 'dos Afogados', 'da Última Colheita', 'do Sino Partido',
  'de Pedra Oca', 'dos Mil Degraus', 'do Véu Rasgado', 'da Mão Aberta', 'dos Ossos Brancos',
  'do Fogo Manso', 'das Três Luas', 'do Juramento', 'da Chuva Fina', 'do Cão Preto',
  'de Vidro', 'do Poço Fundo', 'da Vela Torta', 'dos Ecos', 'do Dente de Ouro',
  'de Ferro Frio', 'das Raízes', 'do Primeiro Inverno',
];

export const FACTION_ADJ = [
  'Ordem', 'Casa', 'Guilda', 'Irmandade', 'Conselho', 'Legião', 'Círculo', 'Companhia',
  'Sinodo', 'Aliança', 'Clã', 'Sociedade', 'Culto', 'Guarda',
];

export const FACTION_NOUN = [
  'da Chama Quieta', 'do Punho de Sal', 'dos Sete Selos', 'da Coroa Partida', 'do Véu',
  'da Mão Aberta', 'dos Mil Olhos', 'do Juramento Antigo', 'da Roda Quebrada', 'do Sal',
  'da Estrela Torta', 'dos Sem-Nome', 'do Dente de Ferro', 'da Última Porta', 'do Peso Justo',
  'da Cinza Fértil', 'dos Afogados', 'do Relógio Mudo', 'da Ponte Nova', 'do Sangue Limpo',
];

export const NPC_QUIRK = [
  'fala sempre num sussurro, mesmo quando grita',
  'nunca olha nos olhos de ninguém',
  'tem as mãos manchadas de tinta',
  'cheira a fumaça de lenha',
  'repete a última palavra da frase anterior',
  'ri antes de dizer qualquer coisa séria',
  'carrega um sino pequeno no bolso',
  'conta moedas enquanto conversa',
  'anda com um passo só, arrastado',
  'tem um tique no olho esquerdo',
  'sempre oferece comida antes de negociar',
  'chama todos de "primo"',
  'usa luvas mesmo no calor',
  'tem uma cicatriz que coça quando mente',
  'gagueja apenas com números',
  'assobia melodias de ninar',
  'não suporta o som de vidro',
  'guarda os dentes que perdeu',
  'dorme de olhos abertos',
  'bebe água de um frasco que nunca enche',
  'cumprimenta as portas antes de passar',
  'tem uma voz que parece vir de outro cômodo',
  'desenha no pó com o dedo',
  'nunca se senta de costas para a janela',
  'pede licença a objetos antes de usá-los',
  'tem sempre uma resposta pronta e errada',
];

export const NPC_VOICE = [
  'grave e lenta', 'aguda e apressada', 'rouca de tanto fumar', 'doce demais para ser sincera',
  'monótona, como quem lê uma lista', 'trêmula quando fala de dinheiro', 'cantada, quase infantil',
  'seca, de quem economiza palavras', 'cheia de pausas incômodas', 'forte, de quem dá ordens',
  'sussurrada, como um segredo', 'quebrada por uma tosse antiga',
];

export const NPC_LOOK = [
  'alto e curvado, como um galho sob neve',
  'baixo e largo, ocupando mais espaço do que devia',
  'magro a ponto de parecer dobrarem-se',
  'de ombros largos e mãos pequenas',
  'com um olho de vidro que não combina',
  'de cabelo raspado e tatuagens no couro cabeludo',
  'com a barba trançada e contas de osso',
  'de pele marcada por queimaduras antigas',
  'sempre envolto num manto úmido',
  'com unhas pintadas de negro',
  'de sorriso fácil e olhos cansados',
  'com uma coroa de cicatrizes no pescoço',
  'de roupas boas, mas gastas nos punhos',
  'com uma pena colorida presa atrás da orelha',
  'de botas grandes demais para os pés',
  'com um dente de ouro que brilha ao falar',
  'de olhos claros demais, quase incômodos',
  'com a pele coberta de pó de giz',
  'de mãos que não param quietas',
  'com uma marca de nascença em forma de folha',
];

export const NPC_OCCUPATION = [
  'estalajadeiro', 'ferreiro', 'escriba', 'coveiro', 'boticário', 'contrabandista',
  'guarda da cidade', 'caçador de recompensas', 'cartógrafo', 'curandeira', 'bardo de esquina',
  'mercador de relíquias', 'pescador', 'padeiro', 'agiota', 'juiz de paz',
  'carcereiro', 'domador de corvos', 'parteira', 'capitão de barca', 'arqueólogo amador',
  'falsificador de selos', 'guia de montanha', 'vidente de feira', 'cortesã',
  'coveiro de animais', 'mestre de obras', 'vigia noturno', 'cobrador de impostos',
  'taverneiro aposentado', 'criança que sabe demais', 'mensageiro', 'lavadeira',
  'monge mendicante', 'vendedor de mapas falsos', 'caçador de ratos', 'toureiro',
  'sineiro', 'bibliotecário', 'carrasco', 'dublê de palco', 'perfumista',
];

export const NPC_DESIRE = [
  'quitar uma dívida que não é sua',
  'encontrar o irmão que sumiu há dez anos',
  'ser aceito pela família que o expulsou',
  'provar que não foi ele quem roubou o selo',
  'comprar de volta a casa em que nasceu',
  'ver o mar antes de morrer',
  'descobrir quem escreveu as cartas anônimas',
  'ser lembrado por alguma coisa',
  'livrar a filha de um casamento arranjado',
  'abrir a própria taverna',
  'sair da cidade sem olhar para trás',
  'encontrar um túmulo que ninguém acha',
  'aprender a ler',
  'vingar um cão envenenado',
  'ser perdoado por uma traição pequena',
  'conseguir uma audiência com o prefeito',
  'esconder o que fez no inverno passado',
  'comprar um barco',
  'curar a própria mão',
  'ser temido, só um pouco',
  'encontrar a pessoa do retrato quebrado',
  'pagar pelo funeral de um estranho',
  'provar que a ponte é amaldiçoada',
  'sair da sombra do pai',
  'ter um dia inteiro de silêncio',
  'descobrir o próprio nome verdadeiro',
];

export const NPC_SECRET = [
  'foi ele quem apagou o incêndio — e quem o começou',
  'deve três favores a alguém que não deveria existir',
  'tem um irmão do outro lado da lei',
  'falsificou a própria certidão de nascimento',
  'guarda um objeto roubado dentro da parede',
  'sabe ler os lábios e ninguém suspeita',
  'foi soldado do lado perdedor e trocou de nome',
  'tem uma dívida de sangue com a guilda',
  'vende informações para dois lados',
  'não é quem diz ser: é o irmão gêmeo',
  'tem medo de água desde o afogamento',
  'escreve cartas de amor para alguém que nunca responde',
  'testemunhou um crime e mentiu no julgamento',
  'carrega a chave de uma porta que jurou nunca abrir',
  'sabe onde está o corpo',
  'foi o primeiro a ver o sinal no céu',
  'está doente e esconde de todos',
  'tem um filho que não sabe que existe',
  'traiu o antigo patrão por uma quantia pequena',
  'é devoto de um santo proibido',
  'guarda o diário de uma pessoa morta',
  'mentiu sobre o próprio nome numa aposta',
  'sabe o segredo da fonte da praça',
  'deve a vida a um monstro',
  'tem uma marca que só aparece à luz da lua',
  'foi quem escreveu o bilhete que todos procuram',
];
