# Acessibilidade no Petflow

## Textos da interface (AITIL-6)

- Use frases curtas e diretas em português. Comece ações com um verbo: **Cadastrar cliente**, **Salvar**, **Cancelar agendamento**.
- Prefira títulos que nomeiem o conteúdo. Use **Agenda** e **Resumo financeiro**.
- Dê a cada campo um rótulo visível. Use exemplos para formatos e explique restrições antes do envio.
- Em erros, identifique o problema e diga como corrigir quando houver uma ação possível. Confirme o resultado de ações concluídas.
- Confira se nomes, valores, condições e horários continuam disponíveis após a revisão.

A página inicial deste sistema é o login. Os pets aparecem no perfil do cliente e no cadastro administrativo. Esta versão não tem uma rota Sobre.

## Leitura e cores (AITIL-8 e AITIL-9)

As opções de leitura estão disponíveis no canto inferior da tela. As preferências são salvas no navegador e podem ser restauradas pelo mesmo painel.

A paleta padrão e os gradientes seguem o design anterior aos controles de leitura (`375c8270`). O alto contraste personalizado foi removido. Os tamanhos disponíveis são 100%, 115%, 130% e 150%. Preferências antigas de 200% voltam a 100%, preservando as demais opções válidas.

Roteiro de validação:

1. Abra o painel pelo teclado e percorra todos os controles. Teste os aumentos de fonte, o espaçamento, o negrito, o realce e o sublinhado.
2. Combine negrito e realce. Navegue entre páginas, recarregue e confira se as escolhas persistem. Use **Restaurar padrão** e confira novamente.
3. Confira a leitura e as ações com texto a 150%. Examine login, formulários, agenda, produtos e perfil em janela estreita.
4. Compare texto e fundo nas telas principais. Use 4,5:1 para texto normal e 3:1 para texto grande e componentes gráficos essenciais.
5. Confira se os estados da agenda, o aviso de estoque e os indicadores financeiros são compreensíveis em escala de cinza. Teste as preferências de movimento reduzido e cores forçadas do sistema.

## Hub de acessibilidade (AITIL-7, 11, 63)

O botão **Acessibilidade**, no canto inferior direito, abre o painel do Hub. Atalho de teclado: **Alt + Shift + A**. **Esc** fecha o painel e devolve o foco ao botão.

O painel reúne:

- **Perfis prontos:** *Baixa visão* (150%, negrito, mais espaço, realce e sublinhado) e *Dislexia* (115%, fonte Atkinson Hyperlegible, mais espaço entre linhas e palavras, linhas curtas, texto à esquerda e máscara de leitura).
- **Texto:** tamanho (100% a 150%), espaço entre linhas e entre palavras, negrito, linhas de até 70 caracteres e alinhamento à esquerda.
- **Dislexia e leitura:** fonte Atkinson Hyperlegible (arquivos locais em `src/assets/fonts`, licença OFL) e **máscara de leitura**.
- **Destaques e cores:** realce, sublinhado e paleta com padrões e ícones.
- **Atalhos da página:** ir ao conteúdo principal e ao menu, exibidos só quando existem na tela.
- **Restaurar padrão.** Tudo é salvo no navegador (`localStorage`, chave `petflow.reading-preferences`).

**Máscara de leitura:** escurece a tela e deixa livre uma faixa horizontal que acompanha o mouse, o toque e o foco do teclado. **Alt + ↑ / ↓** move a faixa. Existe uma versão mais larga. A máscara não bloqueia cliques e fica abaixo do Hub.

Implementação: `app.component.*` (Hub), `shared/a11y/reading-mask.component.ts` e as classes `reading-*` em `src/styles.css`.

## Estrutura, teclado e leitores de tela (AITIL-10, 41 a 45, 55 a 59)

- **Título por rota:** toda rota tem `title`, e a aba mostra "Página | PetFlow". Ao navegar, o app anuncia "Página carregada: …" a leitores de tela e leva o foco ao conteúdo principal (`route-announcer.component.ts`, `page-title.strategy.ts`).
- **Landmarks e headings:** cada página tem um `h1`, sem saltos de nível. O menu lateral tem `aria-label` e `aria-current="page"`. As páginas do cliente e o cadastro público recebem `role="main"` pela diretiva `appMainLandmark`, porque o `ClienteLayoutComponent` não é usado nas rotas.
- **Link "Pular para o conteúdo principal"** no layout administrativo (`appSkipLink`).
- **Foco visível:** contorno de 3px (`--color-focus`) com halo branco, definido em `:focus-visible`. Não use `outline: none` sem substituto.
- **Modais:** use `appModal` (`role="dialog"`, `aria-modal`, foco preso, fundo inerte, Esc e retorno do foco). Exemplo: `<div class="modal" appModal appModalLabelledby="titulo" (appModalClose)="fechar()">`. O botão fechar precisa de `aria-label="Fechar"`.
- **Formulários:** use `appFormA11y` em `<form [formGroup]>` com `formControlName` estático e `.form-group`. Ele marca campos obrigatórios (`aria-required` e "(obrigatório)"), liga a mensagem de erro ao campo (`aria-invalid` e `aria-describedby`), cria a mensagem quando o template não tem uma e leva o foco ao primeiro campo inválido no envio. Não desabilite o botão de envio por formulário inválido: o usuário de teclado e de leitor de tela precisa chegar às mensagens. Login e modais usam `appFocusInvalid` com os atributos escritos à mão.
- **Calendário da agenda:** o botão **Lista** mostra os agendamentos do período em uma tabela, com a ação **Concluir**, como alternativa ao calendário gráfico.
- **Cor:** o azul primário passou de `#007bff` para `#0069d9` (5,2:1 com texto branco) e os textos de erro vermelhos para `#b00020` (7,2:1), exigência de AA que o axe apontou.

## Verificação automática (AITIL-40 e 60)

- `npm run test:ci`: suíte completa no ChromeHeadless, incluindo `shared/a11y/axe.spec.ts` (axe-core, WCAG 2.0/2.1 A e AA, nas telas de login, modal de pet e Hub).
- `npm run test:a11y`: só os testes de acessibilidade.
- `npm run a11y:lighthouse`: auditoria Lighthouse (categoria acessibilidade) com o app em `http://localhost:4200`. Gera `lighthouse-a11y.html`.
- Pipeline: `.github/workflows/acessibilidade.yml` roda `npm ci`, `test:ci` e `build` em todo push e pull request que mude `petflow-web`.
- Ferramentas de apoio manual: extensão axe DevTools, WAVE e o painel Acessibilidade do Chrome.

## Testes que dependem de pessoas (AITIL-22 a 26, 34, 46, 47 e 51)

A verificação automática cobre só uma parte dos critérios do WCAG. Estes testes **ainda precisam ser feitos** e registrados:

1. **Leitores de tela:** NVDA + Firefox/Chrome (Windows), VoiceOver + Safari (macOS/iOS) e TalkBack + Chrome (Android). Percorra login, agenda (calendário e lista), abertura e fechamento de modais, envio de formulário com erro, troca de página e o Hub. Confirme que o título da página, os erros de campo, o estado do botão "Mostrar senha" e o anúncio "Página carregada" são lidos.
2. **Teclado:** percorra cada tela só com Tab, Shift+Tab, Enter, Espaço e Esc. Confirme que o foco nunca fica preso fora de um modal, que a ordem segue a ordem visual e que o contorno de foco aparece sempre.
3. **Baixa visão:** com a máscara de leitura, 150% de fonte e zoom do navegador a 200% e 400%, confirme leitura e operação sem perda de conteúdo.
4. **Dislexia:** com o perfil *Dislexia*, peça a pessoas do público-alvo que leiam e preencham um formulário e registrem dificuldades.
5. **Checklist final WCAG 2.1 AA** (AITIL-26) e **notas de entrega** (AITIL-27): preencher com o resultado dos itens acima.

## Limites conhecidos

- O contraste foi verificado pelo axe nas telas testadas; gradientes decorativos com `#007bff` (cabeçalhos do dashboard, do perfil e dos agendamentos) mantêm a cor original e merecem conferência manual.
- A fonte OpenDyslexic não está incluída; a opção usa Atkinson Hyperlegible.
- O calendário gráfico (angular-calendar) continua sendo uma grade visual. A alternativa acessível é a visão em lista.
- O `ClienteLayoutComponent` e os componentes administrativos `agendamento-modal` e `meus-agendamentos` não estão ligados às rotas; receberam apenas os ajustes mínimos.
