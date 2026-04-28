# LWC Context + `@lwc/state` (PoC)

Documentacao introdutoria da PoC de gerenciamento de estado reativo em LWC usando Context API (`fromContext`) e state manager oficial (`defineState`).

## O que e

Esta PoC valida compartilhamento de estado entre componentes LWC que estao na mesma subarvore do DOM, sem depender de eventos customizados complexos ou do Lightning Message Service (LMS) para comunicacao local.

Status atual da PoC:

- em construcao
- testado em ambiente de desenvolvimento
- resultado percebido como muito positivo para reduzir boilerplate

## Problema que ele resolve

Em cenarios de composicao de UI com componentes irmaos e descendentes, o fluxo tradicional costuma gerar:

- propagacao de dados por varias camadas (prop drilling)
- eventos customizados em cadeia
- acoplamento elevado para sincronizar estado local da feature

Com Context + `@lwc/state`, a mesma instancia de estado fica disponivel para toda a subarvore, reduzindo complexidade de comunicacao.

## Status e disponibilidade

`@lwc/state` e `fromContext` estao em Developer Preview/Beta e podem depender de feature flags e da versao do servidor Salesforce.

Recomendacoes:

- validar sempre em sandbox/scratch org antes de adotar
- confirmar release e API version da org alvo
- evitar uso em producao sem validacao formal

## Arquitetura da solucao

Componentes principais:

- `c/smShop` (`force-app/main/default/lwc/smShop`)
  - modulo de estado
  - define `atom` (`items`), `computed` (`cartTotal`) e mutacoes (`addItem`/`setAtom`)
- `c/shopContextPoc` (`force-app/main/default/lwc/shopContextPoc`)
  - provider
  - instancia e expoe o state manager para os descendentes
- `c/shopContextAdder` (`force-app/main/default/lwc/shopContextAdder`)
  - consumer de escrita
  - dispara a adicao de itens no estado compartilhado
- `c/shopContextPanel` (`force-app/main/default/lwc/shopContextPanel`)
  - consumer de leitura
  - renderiza lista e total em tempo real

## Como funciona

Fluxo reativo da PoC:

1. O usuario interage com `shopContextAdder` (ex: botao "Adicionar item aleatorio").
2. O consumer chama a acao `addItem` no contexto.
3. O state manager atualiza o `atom` `items`.
4. O `computed` `cartTotal` e recalculado automaticamente.
5. Provider e consumers que observam o estado re-renderizam apenas o necessario.

Ponto central: `smShop` funciona como fonte unica da verdade para a feature.

## Deploy e teste

Para evitar erro de dependencia, faca deploy dos bundles juntos:

```bash
sf project deploy start --source-dir force-app/main/default/lwc/smShop --source-dir force-app/main/default/lwc/shopContextAdder --source-dir force-app/main/default/lwc/shopContextPanel --source-dir force-app/main/default/lwc/shopContextPoc
```

Teste no App Builder:

1. Abrir o Lightning App Builder.
2. Adicionar o componente **Shop Context PoC** na pagina.
3. Salvar e ativar a pagina.
4. Clicar em **Adicionar item aleatorio** e verificar atualizacao simultanea do painel e do total.

## Troubleshooting

Erro: `No MODULE named markup://c:smShop found`

- Causa provavel: `smShop` foi criado como arquivo `.js` solto, nao como bundle.
- Solucao: manter estrutura de bundle com `smShop.js` e `smShop.js-meta.xml`.

Erro de import de `fromContext`

- Causa provavel: import feito de `lwc`.
- Solucao: importar `fromContext` de `@lwc/state`.

Estado nao atualiza nos filhos

- Causa provavel: consumer fora da hierarquia do provider.
- Solucao: garantir que os consumers sejam descendentes diretos ou indiretos de `shopContextPoc`.

## Quando usar Context + `@lwc/state` vs LMS

Use Context + `@lwc/state` quando:

- o escopo e local da subarvore do DOM
- existe relacao de hierarquia pai/filho
- o objetivo e compartilhar estado de uma feature local com alta performance

Use LMS quando:

- a comunicacao precisa ser global na pagina
- os componentes nao possuem relacao de hierarquia
- ha integracao entre LWC, Aura e Visualforce

## Boas praticas

- Centralize regras de mutacao no modulo de estado (`smShop`).
- Mantenha o provider no nivel mais baixo possivel da feature para limitar escopo.
- Evite colocar regra de negocio pesada no consumer; use o state manager.
- Padronize a nomenclatura de atoms, computeds e acoes.
- Cubra calculos derivados com testes unitarios.

## Checklist rapido de adocao

- [ ] confirmar disponibilidade de `@lwc/state` na org alvo
- [ ] validar provider e consumers na mesma subarvore
- [ ] deployar todos os bundles dependentes juntos
- [ ] testar fluxo de mutacao e recomputacao em tempo real
- [ ] definir fallback para org sem suporte (ex: LMS/eventos)
