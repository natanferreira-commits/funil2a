# Quiz Dupla Aposta

Landing + quiz de qualificação pro grupo gratuito do Dupla Aposta.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Deploy: Vercel

## Estrutura do funil

1. **Landing** — hero + CTA "Responder teste"
2. **Q1** — Nível com apostas
3. **Q2** — Pergunta fácil de futebol (quantos jogadores em campo)
4. **Intermezzo** — Prova social da comunidade (sem valores $)
5. **Q3** — Pergunta fácil de futebol (sede da Copa 2026)
6. **Q4** — Frequência de acompanhar futebol
7. **Loading fake** — Simula processamento e "seleção" de grupo
8. **Página final** — Personalizada com base nas respostas + CTA de entrada

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## Deploy no Vercel

1. `git init` na pasta, commita tudo, sobe pra repositório.
2. No Vercel, importa o repo — detecta Next automaticamente.
3. Não precisa de env vars nesta versão.

## Imagem de fundo

Colocar `bg.jpg` (ou `.png`) dentro de `/public/`.

O CSS usa a var `--bg-image` (definida em `app/globals.css`) — se quiser trocar de arquivo, ajusta lá.

Recomendado: 1920x1080 ou maior, com foco visual no centro/topo (o texto fica por cima).

## Link do grupo

O link final aponta pra `https://t.me/+WKCKukzGF0lpY1Ws` (grupo gratuito do Dupla).

Trocar em `app/page.tsx` na função `FinalScreen` (procura por `href="https://t.me/...`).

## Compliance

- Rodapé com +18, aviso do MF, e placeholder de "Casas parceiras autorizadas SPA/MF".
- Quando as casas forem definidas, listar nº SPA/MF de cada uma no rodapé ou dentro do grupo.

## Notas de tráfego

- Sem Pixel/CAPI configurado ainda. Adicionar quando decidir se a otimização vai ser por Lead (conclusão do quiz) ou Cadastro (na casa afiliada).
- Sugestão de eventos:
  - `QuizStart` — clique no CTA da landing
  - `QuizComplete` — chegada na página final
  - `ClickGroup` — clique no botão de entrar no grupo
