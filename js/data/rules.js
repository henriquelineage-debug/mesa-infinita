/* ============================================================
   Regras do sistema "d20 leve" do Mesa Infinita
   ============================================================ */

export const ABILITIES = [
  { key: 'for', label: 'Força', short: 'FOR' },
  { key: 'des', label: 'Destreza', short: 'DES' },
  { key: 'con', label: 'Constituição', short: 'CON' },
  { key: 'int', label: 'Inteligência', short: 'INT' },
  { key: 'sab', label: 'Sabedoria', short: 'SAB' },
  { key: 'car', label: 'Carisma', short: 'CAR' },
];

export const ABILITY_LABEL = Object.fromEntries(ABILITIES.map((a) => [a.key, a.label]));
export const ABILITY_SHORT = Object.fromEntries(ABILITIES.map((a) => [a.key, a.short]));

export const SKILLS = [
  { key: 'atletismo', label: 'Atletismo', ability: 'for' },
  { key: 'acrobacia', label: 'Acrobacia', ability: 'des' },
  { key: 'furtividade', label: 'Furtividade', ability: 'des' },
  { key: 'prestidigitacao', label: 'Prestidigitação', ability: 'des' },
  { key: 'arcanismo', label: 'Arcanismo', ability: 'int' },
  { key: 'historia', label: 'História', ability: 'int' },
  { key: 'investigacao', label: 'Investigação', ability: 'int' },
  { key: 'natureza', label: 'Natureza', ability: 'int' },
  { key: 'religiao', label: 'Religião', ability: 'int' },
  { key: 'percepcao', label: 'Percepção', ability: 'sab' },
  { key: 'intuicao', label: 'Intuição', ability: 'sab' },
  { key: 'sobrevivencia', label: 'Sobrevivência', ability: 'sab' },
  { key: 'persuasao', label: 'Persuasão', ability: 'car' },
  { key: 'intimidacao', label: 'Intimidação', ability: 'car' },
  { key: 'atuacao', label: 'Atuação', ability: 'car' },
  { key: 'enganacao', label: 'Enganação', ability: 'car' },
];

export const SKILL_LABEL = Object.fromEntries(SKILLS.map((s) => [s.key, s.label]));
export const SKILL_ABILITY = Object.fromEntries(SKILLS.map((s) => [s.key, s.ability]));

export const ANCESTRIES = [
  {
    key: 'humano',
    label: 'Humano',
    blurb: 'Ambiciosos e adaptáveis. Em qualquer cidade, há um humano devendo um favor a alguém.',
    size: 'Médio',
    speed: 9,
    bonuses: { for: 1, car: 1 },
    traits: [
      { name: 'Versátil', text: 'Ganha +1 em dois atributos diferentes (já aplicado).' },
      { name: 'Ambição', text: 'Uma vez por descanso longo, repita uma rolagem de perícia.' },
    ],
  },
  {
    key: 'anao',
    label: 'Anão da Forja',
    blurb: 'Teimosos como a pedra e igualmente difíceis de mover. Medem o mundo em juramentos e dívidas.',
    size: 'Médio',
    speed: 7.5,
    bonuses: { con: 2 },
    traits: [
      { name: 'Pele de Pedra', text: '+2 pontos de vida por nível.' },
      { name: 'Visão no Escuro', text: 'Enxerga até 18 m na penumbra como se fosse luz plena.' },
      { name: 'Ofício Antigo', text: 'Vantagem em testes para avaliar metal, pedra ou construção.' },
    ],
  },
  {
    key: 'elfo',
    label: 'Elfo do Crepúsculo',
    blurb: 'Vivem entre duas luzes e desconfiam das duas. A paciência é a arma deles.',
    size: 'Médio',
    speed: 9,
    bonuses: { des: 2, sab: 1 },
    traits: [
      { name: 'Sentidos Aguçados', text: '+2 em Percepção (já somado nas perícias).' },
      { name: 'Transe', text: 'Descansa em 4 horas, consciente do que o cerca.' },
    ],
  },
  {
    key: 'pequenino',
    label: 'Pequenino',
    blurb: 'Pequenos no tamanho, enormes na ousadia. A melhor fuga é aquela que ninguém viu começar.',
    size: 'Pequeno',
    speed: 7.5,
    bonuses: { des: 2, car: 1 },
    traits: [
      { name: 'Sortudo', text: 'Uma vez por sessão, role novamente um 1 natural.' },
      { name: 'Pequeno e Ágil', text: 'Passa pelo espaço de criaturas maiores e se esconde atrás delas.' },
    ],
  },
  {
    key: 'orc',
    label: 'Orc da Tempestade',
    blurb: 'Carregam a fúria do céu aberto. Quem os subestima costuma não repetir o erro.',
    size: 'Médio',
    speed: 9,
    bonuses: { for: 2, con: 1 },
    traits: [
      { name: 'Vigor Implacável', text: 'Ao cair a 0 PV, fica de pé com 1 PV. Uma vez por descanso longo.' },
      { name: 'Presença Física', text: '+1 em Intimidação (já somado nas perícias).' },
    ],
  },
  {
    key: 'veu',
    label: 'Nascido do Véu',
    blurb: 'Alguém fez uma promessa no lugar deles. A marca no corpo é a assinatura.',
    size: 'Médio',
    speed: 9,
    bonuses: { car: 1, int: 1 },
    traits: [
      { name: 'Chama Interior', text: 'Resistência a fogo. Pode acender ou apagar uma chama pequena à vontade.' },
      { name: 'Herança Inquieta', text: 'Sonha com coisas que ainda não aconteceram. O mestre pode usar isso.' },
    ],
  },
  {
    key: 'silfide',
    label: 'Silfide',
    blurb: 'Nascidos entre folhas e orvalho. O mundo grande é barulhento demais.',
    size: 'Pequeno',
    speed: 7.5,
    bonuses: { des: 2, sab: 1 },
    traits: [
      { name: 'Asas Minúsculas', text: 'Voo curto (6 m) por turno, sem armadura pesada.' },
      { name: 'Voz de Vento', text: 'Pode falar com animais pequenos e plantas.' },
    ],
  },
  {
    key: 'gigante',
    label: 'Gigante de Sangue',
    blurb: 'Descendentes de algo antigo e enorme. Aprendem cedo que o mundo é feito de coisas frágeis.',
    size: 'Médio',
    speed: 10.5,
    bonuses: { for: 2, con: 2 },
    traits: [
      { name: 'Passada Longa', text: '+1,5 m de deslocamento.' },
      { name: 'Carga Pesada', text: 'Capacidade de carga dobrada; vantagem em testes de Atletismo para empurrar.' },
    ],
  },
];

export const CLASSES = [
  {
    key: 'guerreiro',
    label: 'Guerreiro',
    blurb: 'Resolve problemas com aço e disciplina. Sabe que toda briga começa antes do primeiro golpe.',
    hpBase: 10,
    armor: 3,
    primary: 'for',
    secondary: 'con',
    skills: ['atletismo', 'intimidacao', 'percepcao', 'sobrevivencia', 'historia'],
    weapons: [
      { name: 'Espada longa', damage: '1d8', ability: 'for', note: 'versátil (1d10)' },
      { name: 'Escudo', damage: '1d4', ability: 'for', note: '+2 Defesa' },
    ],
    gear: ['cota de malha', 'escudo com brasão apagado', 'corda de 15 m', 'pedra de amolar', 'ração de 3 dias'],
    trait: { name: 'Postura de Combate', text: 'Uma vez por combate, impõe desvantagem no ataque de um inimigo que possa ver.' },
  },
  {
    key: 'ladino',
    label: 'Ladino',
    blurb: 'Não rouba por ganância: rouba para saber onde as coisas estão guardadas.',
    hpBase: 8,
    armor: 1,
    primary: 'des',
    secondary: 'int',
    skills: ['furtividade', 'prestidigitacao', 'investigacao', 'enganacao', 'acrobacia', 'percepcao'],
    weapons: [
      { name: 'Adaga', damage: '1d4', ability: 'des', note: 'leve, arremesso 6/18 m' },
      { name: 'Besta de mão', damage: '1d6', ability: 'des', note: 'recarga' },
    ],
    gear: ['ferramentas de ladrão', 'capa escura', '10 m de corda fina', 'dados viciados', 'lanterna cega'],
    trait: { name: 'Ataque Furtivo', text: 'Uma vez por turno, +1d6 de dano quando tem vantagem ou um aliado adjacente ao alvo.' },
  },
  {
    key: 'mago',
    label: 'Mago',
    blurb: 'Passou anos lendo o que ninguém deveria ler. Agora as palavras leem de volta.',
    hpBase: 6,
    armor: 0,
    primary: 'int',
    secondary: 'sab',
    skills: ['arcanismo', 'historia', 'investigacao', 'religiao', 'intuicao'],
    weapons: [
      { name: 'Cajado', damage: '1d6', ability: 'for', note: 'foco arcano' },
      { name: 'Dardo arcano', damage: '1d10', ability: 'int', note: 'alcance 18 m' },
    ],
    gear: ['grimório com 3 feitiços', 'tinta e pena', 'velas', 'lente rachada', 'bolsa de componentes'],
    trait: { name: 'Leitura Rápida', text: 'Gasta metade do tempo para decifrar textos, mapas ou inscrições.' },
  },
  {
    key: 'clerigo',
    label: 'Clérigo',
    blurb: 'Ouviu uma resposta e não conseguiu esquecer. Carrega o peso de saber que ela era para ele.',
    hpBase: 8,
    armor: 2,
    primary: 'sab',
    secondary: 'con',
    skills: ['religiao', 'intuicao', 'persuasao', 'historia', 'percepcao'],
    weapons: [
      { name: 'Maça', damage: '1d6', ability: 'for', note: 'contundente' },
      { name: 'Símbolo sagrado', damage: '1d6', ability: 'sab', note: 'luz e bênção' },
    ],
    gear: ['cota de escamas', 'símbolo sagrado rachado', 'incenso', 'livro de orações', 'kit de curandeiro'],
    trait: { name: 'Bênção', text: 'Uma vez por descanso, um aliado rola novamente um teste falho.' },
  },
  {
    key: 'bardo',
    label: 'Bardo',
    blurb: 'Coleciona histórias como outros colecionam moedas. Sabe que uma boa mentira vale mais que uma verdade ruim.',
    hpBase: 8,
    armor: 1,
    primary: 'car',
    secondary: 'des',
    skills: ['atuacao', 'persuasao', 'enganacao', 'historia', 'intuicao', 'prestidigitacao'],
    weapons: [
      { name: 'Rapieira', damage: '1d8', ability: 'des', note: 'leve' },
      { name: 'Alaúde', damage: '1d4', ability: 'car', note: 'inspiração' },
    ],
    gear: ['alaúde com uma corda trocada', 'roupas boas e gastas', 'caderno de fofocas', 'frasco de vinho', 'dado de osso'],
    trait: { name: 'Inspiração', text: 'Uma vez por cena, dê vantagem a um aliado (ou a si mesmo) em um teste.' },
  },
  {
    key: 'patrulheiro',
    label: 'Patrulheiro',
    blurb: 'Conhece o caminho porque já se perdeu nele. Fala pouco e come bem.',
    hpBase: 10,
    armor: 2,
    primary: 'des',
    secondary: 'sab',
    skills: ['sobrevivencia', 'natureza', 'percepcao', 'furtividade', 'atletismo'],
    weapons: [
      { name: 'Arco longo', damage: '1d8', ability: 'des', note: 'alcance 45 m' },
      { name: 'Faca de caça', damage: '1d6', ability: 'des', note: 'leve' },
    ],
    gear: ['gibão de couro', 'arco e 20 flechas', 'armadilha de laço', 'capa de chuva', 'mapa com anotações'],
    trait: { name: 'Rastreador', text: 'Vantagem em testes para seguir rastros e encontrar alimento no ermo.' },
  },
  {
    key: 'barbaro',
    label: 'Bárbaro',
    blurb: 'A fúria não é falta de controle: é o único controle que lhe ensinaram.',
    hpBase: 12,
    armor: 1,
    primary: 'for',
    secondary: 'con',
    skills: ['atletismo', 'intimidacao', 'sobrevivencia', 'percepcao', 'natureza'],
    weapons: [
      { name: 'Machado grande', damage: '1d12', ability: 'for', note: 'pesado' },
      { name: 'Machadinha', damage: '1d6', ability: 'for', note: 'leve, arremesso' },
    ],
    gear: ['peles de animais', 'machado grande', 'cantil de bebida forte', 'amuleto de dentes', 'saco de dormir'],
    trait: { name: 'Fúria', text: 'Uma vez por combate, +2 de dano por 3 turnos; sofre −1 Defesa enquanto dura.' },
  },
  {
    key: 'bruxo',
    label: 'Bruxo',
    blurb: 'Fez um acordo e recebeu exatamente o que pediu. É esse o problema.',
    hpBase: 8,
    armor: 1,
    primary: 'car',
    secondary: 'con',
    skills: ['arcanismo', 'enganacao', 'intuicao', 'religiao', 'investigacao'],
    weapons: [
      { name: 'Adaga ritual', damage: '1d4', ability: 'des', note: 'leve' },
      { name: 'Raio do pacto', damage: '1d10', ability: 'car', note: 'alcance 18 m' },
    ],
    gear: ['manto de cinza', 'amuleto do pacto', 'frasco de tinta negra', 'contrato dobrado', 'vela que não derrete'],
    trait: { name: 'Favor do Pacto', text: 'Uma vez por sessão, peça um detalhe verdadeiro sobre a cena ao mestre.' },
  },
];

export const BACKGROUNDS = [
  {
    key: 'acolito', label: 'Acólito', skills: ['religiao', 'intuicao'],
    item: 'um livro de orações com anotações nas margens',
    trait: { personality: 'Cita escrituras mesmo quando ninguém pediu.', ideal: 'A fé deve ser provada, não herdada.', bond: 'Devo tudo ao templo que me criou.', flaw: 'Confio mais em sinais do que em pessoas.' },
  },
  {
    key: 'batedor', label: 'Batedor', skills: ['sobrevivencia', 'percepcao'],
    item: 'um mapa dobrado de uma região que não existe mais',
    trait: { personality: 'Fala pouco e ouve tudo.', ideal: 'O caminho certo é o que se faz com os próprios pés.', bond: 'Nunca deixo alguém para trás na estrada.', flaw: 'Não suporto lugares fechados.' },
  },
  {
    key: 'contrabandista', label: 'Contrabandista', skills: ['furtividade', 'enganacao'],
    item: 'um compartimento falso na bota',
    trait: { personality: 'Sempre sabe o preço de tudo.', ideal: 'Regras são sugestões de quem tem mais poder.', bond: 'Devo minha vida a um barqueiro de quem não sei o nome.', flaw: 'Minto antes de pensar.' },
  },
  {
    key: 'erudito', label: 'Erudito', skills: ['historia', 'investigacao'],
    item: 'um caderno com metade das páginas arrancadas',
    trait: { personality: 'Corrige os outros por hábito, não por maldade.', ideal: 'O conhecimento pertence a quem o procura.', bond: 'Procuro o autor do livro que me ensinou a ler.', flaw: 'Não consigo deixar uma pergunta sem resposta.' },
  },
  {
    key: 'forasteiro', label: 'Forasteiro', skills: ['sobrevivencia', 'atletismo'],
    item: 'uma pedra da sua terra natal, ainda com terra',
    trait: { personality: 'Estranha as regras da cidade, mas respeita as da estrada.', ideal: 'A terra não mente.', bond: 'Voltarei para casa antes do próximo inverno.', flaw: 'Desconfio de qualquer um que use sapatos bons.' },
  },
  {
    key: 'gladiador', label: 'Gladiador', skills: ['atletismo', 'atuacao'],
    item: 'uma fita de pano de uma arena que não existe mais',
    trait: { personality: 'Trata toda conversa como um duelo.', ideal: 'Quem entretém o povo nunca é esquecido.', bond: 'Devo a liberdade a alguém que morreu na areia.', flaw: 'Não sei recuar de uma plateia.' },
  },
  {
    key: 'artesao', label: 'Artesão', skills: ['investigacao', 'persuasao'],
    item: 'as ferramentas do seu antigo mestre',
    trait: { personality: 'Avalia tudo pelo acabamento.', ideal: 'O trabalho bem feito é uma forma de oração.', bond: 'Minha oficina foi tomada por uma dívida.', flaw: 'Não consigo aceitar ajuda.' },
  },
  {
    key: 'nobre', label: 'Nobre', skills: ['persuasao', 'historia'],
    item: 'um anel com o brasão da família riscado',
    trait: { personality: 'Trata estranhos como se fossem convidados.', ideal: 'Privilégio é dívida disfarçada.', bond: 'Preciso limpar o nome da minha casa.', flaw: 'Não sei pedir desculpas.' },
  },
  {
    key: 'soldado', label: 'Soldado', skills: ['atletismo', 'intimidacao'],
    item: 'uma insígnia de um regimento dissolvido',
    trait: { personality: 'Dorme em posição de sentido.', ideal: 'A disciplina é o que resta quando a coragem acaba.', bond: 'Ainda respondo ao meu antigo capitão.', flaw: 'Obedeço a ordens mesmo quando erradas.' },
  },
  {
    key: 'mendigo', label: 'Mendigo', skills: ['intuicao', 'furtividade'],
    item: 'uma tigela de estanho amassada',
    trait: { personality: 'Sabe o nome de todo mundo na rua.', ideal: 'Ninguém deveria dormir com fome.', bond: 'Devo minha sobrevivência a uma criança sem nome.', flaw: 'Escondo comida mesmo quando há o suficiente.' },
  },
  {
    key: 'cacador', label: 'Caçador de Monstros', skills: ['arcanismo', 'sobrevivencia'],
    item: 'um frasco de sal consagrado',
    trait: { personality: 'Fala de monstros como quem fala do clima.', ideal: 'O sobrenatural tem regras. Basta descobri-las.', bond: 'Caço a coisa que matou minha irmã.', flaw: 'Vejo sinal de monstro em tudo.' },
  },
  {
    key: 'artista', label: 'Artista', skills: ['atuacao', 'persuasao'],
    item: 'um instrumento que ninguém sabe tocar direito',
    trait: { personality: 'Transforma qualquer história em espetáculo.', ideal: 'Uma boa história vale mais que uma verdade confortável.', bond: 'Prometi uma canção a alguém que não pode mais ouvir.', flaw: 'Exagero até quando não preciso.' },
  },
];

export const TRAITS = {
  personality: [
    'Fala com objetos como se eles respondessem.',
    'Não consegue ficar quieto quando alguém está errado.',
    'Guarda tudo o que encontra, por via das dúvidas.',
    'Trata todo estranho como velho conhecido.',
    'Prefere ouvir a falar, mas interrompe quando se anima.',
    'Tem um humor seco que ninguém entende de primeira.',
    'Sempre acha que há uma segunda intenção.',
    'Age primeiro e se arrepende em voz alta depois.',
    'É generoso com o que não é seu.',
    'Desconfia de elogios.',
    'Fala baixo quando está com raiva.',
    'Não suporta ver alguém humilhado.',
    'Anota tudo em pedaços de papel.',
    'Dá nomes a animais e a armas.',
    'Prefere dormir ao relento a dormir em cama estranha.',
    'Conta histórias que nunca terminam.',
  ],
  ideal: [
    'A verdade, mesmo quando dói.',
    'Lealdade a quem ficou.',
    'Liberdade acima de conforto.',
    'Ordem: sem ela, nada se constrói.',
    'Conhecimento não deve ser guardado.',
    'Justiça não é vingança, mas às vezes parece.',
    'Beleza é a única prova de que algo importa.',
    'Poder deve ser usado, não temido.',
    'Ninguém escolhe onde nasce.',
    'Promessas valem mais que contratos.',
    'A vida é curta; a história, longa.',
    'O medo é um conselheiro, não um senhor.',
    'Cada um carrega o seu próprio peso.',
    'Não se abandona um companheiro.',
    'O passado cobra juros.',
    'Há sempre uma saída — só não é a que se quer.',
  ],
  bond: [
    'Devo tudo a uma pessoa que talvez não exista mais.',
    'Tenho uma dívida que não sei como pagar.',
    'Prometi proteger alguém que não pediu.',
    'Carrego o nome de uma casa que já caiu.',
    'Voltarei à aldeia, mesmo que só para ver.',
    'Perdi alguém e ainda procuro.',
    'Guardo um objeto que não é meu e não devolvo.',
    'Um velho inimigo ainda vive.',
    'Devo minha vida a um estranho.',
    'Tenho um irmão do outro lado da lei.',
    'O lugar onde cresci foi tomado.',
    'Escrevo cartas para alguém que nunca responde.',
    'Prometi não beber até terminar isso.',
    'A única pessoa que me entende está presa.',
    'Devo um favor a uma guilda que não perdoa.',
    'Minha história precisa ser contada por alguém.',
  ],
  flaw: [
    'Não consigo admitir que estou perdido.',
    'Bebo para não pensar.',
    'Minto por reflexo.',
    'Tenho medo de altura, e não escondo.',
    'Não confio em ninguém que sorria fácil.',
    'Sou avarento com o que ganho.',
    'Perco a paciência com tolos.',
    'Não consigo deixar uma aposta na mesa.',
    'Fujo de conversas sobre o passado.',
    'Acredito em qualquer história bem contada.',
    'Guardo rancor por coisas pequenas.',
    'Prefiro estar certo a estar vivo.',
    'Não sei recusar um pedido de ajuda.',
    'Tenho um vício caro.',
    'Falo demais quando estou nervoso.',
    'Subestimo quem parece fraco.',
  ],
};

export const CONDITIONS = [
  'Caído', 'Atordoado', 'Envenenado', 'Amedrontado', 'Sangrando',
  'Exausto', 'Invisível', 'Agarrado', 'Abençoado', 'Amaldiçoado',
];

export const XP_THRESHOLDS = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000,
  85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
];

export const MOD = (score) => Math.floor((Number(score || 10) - 10) / 2);
export const proficiency = (level) => 2 + Math.floor((Math.max(1, level) - 1) / 4);
export const xpForLevel = (level) => XP_THRESHOLDS[Math.min(19, Math.max(0, level - 1))];
export const levelFromXp = (xp) => {
  let lvl = 1;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) if (xp >= XP_THRESHOLDS[i]) lvl = i + 1;
  return lvl;
};

export const findBy = (list, key) => list.find((item) => item.key === key) || list[0];
