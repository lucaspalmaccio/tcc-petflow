# Revisão da interface — 07/11/2026

Comparação dos commits `a60304b8` a `9857ce23` com `375c8270`, anterior aos controles de leitura.

Correções:
- Removidos o alto contraste personalizado e a opção 200%. Preferências antigas são migradas para 100%, mantendo as demais opções válidas.
- Recuperadas a paleta, as bordas e os gradientes anteriores. Removidas regras globais que aumentavam todos os botões e alteravam o layout dos links.
- Preservados os rótulos dos campos, as tabelas com rolagem e os ajustes de formulários estreitos. O menu lateral passa para o topo somente até 768 px.
- Corrigido o perfil, cujo HTML utilizava classes de layout sem estilos correspondentes. Os estilos agora ficam no componente.
- Limitada a altura do modal administrativo de agendamento, com rolagem interna e rodapé acessível. O painel de leitura fica abaixo dos modais.
- Corrigida a configuração da suíte unitária, que não incluía os arquivos de teste, e a referência obsoleta ao componente de perfil.

Validação executada no Edge:
- 16 rotas em 1440, 390 e 320 px, mais as mesmas 16 rotas em 320 px com texto a 150%: 64 verificações, sem transbordamento horizontal da página e sem exceções JavaScript. Tabelas mantêm rolagem interna.
- Rotas: login, cadastro público, dashboard, agenda, listas de clientes/serviços/produtos, criação e edição dessas entidades, cadastro administrativo, perfil e agendamentos do cliente.
- Capturas inspecionadas para conferir cores, alinhamento, campos, tabelas e cards.
- Abertura e fechamento dos modais de agenda e estoque; edição e cancelamento do perfil; abertura e cancelamento dos formulários de pet e senha.
- Migração de preferências antigas, persistência após recarga e restauração do padrão.
- `npm.cmd run build`: aprovado, com avisos de tamanho de bundles/CSS.
- `npm.cmd test -- --watch=false --browsers=ChromeHeadless`: 5 testes aprovados, usando Edge via `CHROME_BIN`.

Limites: testes de interface com respostas de API simuladas e dados fictícios. Não validam autenticação real, persistência no banco nem integrações com o backend. Os agendamentos foram exercitados em estado vazio. Não houve publicação ou alteração de dados reais.
