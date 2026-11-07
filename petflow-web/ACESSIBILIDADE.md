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

| Uso | Cor anterior | Cor revisada |
| --- | --- | --- |
| Ação principal e links | `#007bff` | `#005bb5` |
| Texto secundário | `#6c757d` | `#525e69` |
| Sucesso | `#28a745` | `#17653b` |
| Erro e ação destrutiva | `#dc3545` | `#a91f32` |

Roteiro de validação:

1. Abra o painel pelo teclado e percorra todos os controles. Teste os três aumentos de fonte, o espaçamento, o negrito, o realce e o sublinhado.
2. Combine alto contraste e realce. Navegue entre páginas, recarregue e confira se as escolhas persistem. Use **Restaurar padrão** e confira novamente.
3. Confira a leitura e as ações a 200% de zoom. Examine login, formulários, agenda, produtos e perfil em janela estreita.
4. Compare texto e fundo nas telas principais. Use 4,5:1 para texto normal e 3:1 para texto grande e componentes gráficos essenciais.
5. Confira se os estados da agenda, o aviso de estoque e os indicadores financeiros são compreensíveis em escala de cinza. Teste as preferências de movimento reduzido e cores forçadas do sistema.
