# Mesa Infinita

RPG de mesa **solo** que roda inteiro no navegador: ficha de personagem, rolador de dados, oráculo com tensão, geradores de NPCs, tavernas, missões e masmorras — com arte procedural e diário de campanha.

Sem backend, sem conta, sem rastreamento. HTML, CSS e JavaScript puros, prontos para o **Cloudflare Pages**.

---

## Rodar localmente

O app usa **módulos ES**, então precisa de um servidor (abrir `index.html` direto do disco não funciona).

```bash
npm start
```

Depois abra <http://localhost:4173>. Requer Node 18+.

Alternativas, se preferir:

```bash
npx serve .
# ou
python -m http.server 4173
```

---

## Publicar no Cloudflare Pages

### Opção A — pelo painel (sem CLI)

1. Suba esta pasta para um repositório no GitHub/GitLab.
2. No Cloudflare, vá em **Workers & Pages → Create → Pages → Connect to Git**.
3. Selecione o repositório.
4. Configuração de build:
   - **Framework preset:** `None`
   - **Build command:** *(vazio)*
   - **Build output directory:** `/` (ou a pasta `mesa-infinita` se o repo tiver a raiz acima)
5. Deploy. O arquivo `_headers` já cuida de cache e cabeçalhos de segurança.

### Opção B — envio direto (Wrangler)

```bash
npx wrangler pages deploy . --project-name mesa-infinita
```

### Domínio e HTTPS

O Pages já entrega HTTPS e CDN. Um domínio próprio é configurado em **Custom domains**.

> Ao publicar uma versão nova, troque `VERSION` em `sw.js` (ex.: `mesa-infinita-v2`) para que o service worker descarte o cache antigo.

---

## O que já está pronto (v0.1)

| Módulo | Estado |
| --- | --- |
| Ficha d20 leve (6 atributos, 16 perícias, PV, defesa, condições, XP) | ✅ |
| Geração de personagem completa (8 linhagens, 8 classes, 12 antecedentes) | ✅ |
| Rolador com expressões (`2d6+3`), vantagem/desvantagem e testes por perícia | ✅ |
| Oráculo solo: sim/não com 5 probabilidades, complicação, evento, tensão | ✅ |
| Cenas com lugar, detalhe sensorial e gancho | ✅ |
| Gerador de NPC com retrato procedural | ✅ |
| Gerador de taverna com brasão, dono, rumores e evento | ✅ |
| Gerador de missão com patrono, obstáculo e reviravolta | ✅ |
| Gerador de masmorra com mapa em SVG e salas detalhadas | ✅ |
| Tabelas avulsas (rumor, tesouro, encontro, clima, facção, nomes) | ✅ |
| Diário de campanha com registro automático e exportação | ✅ |
| Vários slots, exportar/importar JSON, salvamento automático | ✅ |
| PWA offline + tema pergaminho sombrio + mobile-first | ✅ |

### Ideias para as próximas ondas

- Combate por turnos com iniciativa e condições mecânicas.
- Editor de tabelas próprias (o jogador cria e sorteia as suas).
- Modo grupo: várias fichas na mesma campanha.
- Importar fichas de outros sistemas (JSON).
- Mapa de mundo por seed, com viagens e encontros por região.
- Exportar o diário em Markdown/PDF.
- Áudio ambiente opcional (sem arquivos pesados).

---

## Como jogar sozinho em 5 passos

1. **Crie uma campanha.** A semente gera o herói e a primeira cena. Guarde a semente: ela reproduz o mesmo começo.
2. **Leia a cena.** Lugar, cheiro, alguém presente e um gancho. Descreva o que o personagem faz.
3. **Pergunte ao oráculo.** Formule uma pergunta de sim/não e escolha a probabilidade. A resposta vem com "e/ou", complicações e eventos.
4. **Suba a tensão.** Cada "não" e cada complicação aumentam a tensão — e a chance de complicação nas próximas perguntas.
5. **Registre.** O diário guarda tudo. Quando a cena fechar, abra outra. A história se escreve sozinha.

**Dica de mesa:** use o oráculo para o que você *não* controla e as tabelas para o que você não quer inventar. O resto é interpretação.

---

## Estrutura

```
index.html              app shell
manifest.webmanifest    PWA
sw.js                   cache offline (mude VERSION a cada deploy)
_headers                cache e segurança no Cloudflare Pages
css/
  base.css              tokens, reset, tipografia, componentes
  app.css               layout, ficha, dados, oráculo, geradores
js/
  main.js               entrada, retomada de campanha, atalhos
  state.js              campanha ativa, diário, salvamento
  core/
    rng.js              mulberry32 + sementes legíveis
    dice.js             parser e rolagem de expressões
    storage.js          slots, exportar/importar, migração
    dom.js              escape, modais, toasts, datas
    bus.js              eventos
  data/
    rules.js            atributos, perícias, linhagens, classes, antecedentes
    names.js            nomes, epítetos, tavernas, topônimos
    tables.js           oráculo, cenas, tavernas, missões, masmorras
  game/
    character.js        geração e estatísticas derivadas
    oracle.js           motor solo (sim/não, eventos, cenas)
    generator.js        NPC, taverna, missão, masmorra, tabelas
  art/
    sigil.js            brasões heráldicos em SVG
    portrait.js         retratos em silhueta
    dungeonmap.js       mapa da masmorra em SVG
  ui/
    router.js           rotas por hash
    parts.js            peças de interface
    newcampaign.js      modal de nova campanha
    settings.js         ajustes, partidas, importar/exportar
    note.js             nota rápida
    views/              campanha, ficha, dados, solo, gerar
dev/serve.mjs           servidor local
```

### Decisões de projeto

- **Zero dependências e zero build.** O navegador carrega os módulos direto; o deploy é só copiar arquivos.
- **RNG com semente.** Todo conteúdo gerado (herói, cena, NPC, taverna, masmorra) vem de uma semente determinística. A mesma semente reproduz o mesmo resultado — útil para compartilhar e para depurar.
- **Dados separados do motor.** As tabelas ficam em `js/data`; o motor só sorteia e monta. Adicionar conteúdo não exige tocar na lógica.
- **Arte procedural, não IA.** Brasões, retratos e mapas são SVG gerados por código: offline, instantâneos, sem custo e sem chave de API.
- **Salvamento versionado.** Cada campanha tem `version` e passa por migração ao carregar. `localStorage` é a fonte; o JSON é a rede de segurança.
- **Acessibilidade.** Foco visível, `aria-*` nos controles, contraste alto, respeito a `prefers-reduced-motion` e navegação por teclado (teclas `1`–`5` trocam de aba).

---

## Licença e conteúdo

Textos, tabelas e arte são originais deste projeto. O sistema é um d20 leve próprio — não é compatível nem derivado do SRD de D&D, o que evita qualquer dependência de licença.

Feito para jogar à mesa, sozinho no ônibus ou às três da manhã.
