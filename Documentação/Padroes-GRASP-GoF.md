# Padrões GRASP e GoF aplicados no Petflow

Todas as mudanças estão em `petflow-api` e **não alteram o comportamento externo** (endpoints, JSONs, mensagens de erro, status HTTP e schema do banco permanecem iguais).

| # | Padrão | Classe(s) | Problema que resolveu |
|---|--------|-----------|-----------------------|
| 1 | GRASP Controlador | `AgendamentoController`, `AgendamentoService.listarAgendamentos(UserDetails, String, String)` | O controller convertia `String` em data (sufixo `Z`) e decidia por perfil. Agora só recebe, delega e devolve `ResponseEntity`. |
| 2 | GRASP Baixo Acoplamento / Alta Coesão | Todos os controllers e services, `SecurityConfig`, `SimpleAuthFilter` | Injeção por campo (`@Autowired`) escondia dependências e dificultava testes. Agora há injeção por construtor com `private final`. |
| 3 | GRASP Especialista na Informação | `Agendamento.pertenceAoEmail`, `cancelar`, `concluir` | Regras sobre cliente e status estavam no service, que navegava `cliente → usuario → email`. A entidade passou a responder por elas. |
| 4 | GRASP Criador | `Cliente.adicionarPet`, `Servico.adicionarProduto` | Quem agrega deve criar. `PetService` instanciava `Pet` com `new` em dois lugares. |
| 5 | GoF Strategy | `EstrategiaPreco`, `PrecoSomaServicos` | O cálculo do valor estava fixo em `criarAgendamento`. Agora é intercambiável. |
| 6 | GoF Factory Method | `ResolvedorCliente`, `ResolvedorClienteAdmin`, `ResolvedorClienteProprio`, `ResolvedorClienteFactory` | O `if/else` por perfil para descobrir o cliente estava dentro do service. |
| 7 | GoF Observer | `AgendamentoConcluidoEvent`, `AuditoriaAgendamentoListener`, `NotificacaoClienteListener` | A conclusão do agendamento não tinha como avisar outras partes sem acoplar o service a elas. Usa o mecanismo de eventos do Spring. |
| 8 | GoF Adapter | `Notificador`, `ProvedorEmailSimulado`, `AdaptadorEmailNotificador` | Adapta a API de um provedor de e-mail (simulado, assinatura diferente) à interface interna do sistema. |

## Antes e depois

### 1. Controlador
```java
// Antes (no controller)
boolean isAdmin = userDetails.getAuthorities().stream().anyMatch(...);
if (isAdmin) { /* converte inicio/fim com ZonedDateTime... */ }

// Depois
List<AgendamentoResponseDTO> agendamentos =
        agendamentoService.listarAgendamentos(userDetails, inicio, fim);
```

### 3. Especialista na Informação
```java
// Antes (no service)
boolean pertenceAoCliente = agendamento.getCliente() != null
        && agendamento.getCliente().getUsuario() != null
        && agendamento.getCliente().getUsuario().getEmail().equalsIgnoreCase(email);

// Depois
if (!agendamento.pertenceAoEmail(email)) { ... }
agendamento.cancelar();   // a própria entidade valida a transição
```

### 4. Criador
```java
// Antes
Pet pet = new Pet(); pet.setNome(...); pet.setCliente(cliente);
// Depois
Pet pet = cliente.adicionarPet(nome, especie, raca);
```

### 5. Strategy
```java
// Antes
BigDecimal valorTotal = servicos.stream().map(Servico::getPreco).reduce(BigDecimal.ZERO, BigDecimal::add);
// Depois
BigDecimal valorTotal = estrategiaPreco.calcular(servicos);
```
Para uma regra futura (ex.: desconto), cria-se outra implementação de `EstrategiaPreco` e escolhe-se qual é injetada (por exemplo com `@Primary` ou `@Qualifier`).

### 6. Factory Method
```java
// Antes
if (usuarioLogado.getPerfil() == PerfilUsuario.ADMIN) { ... } else { ... }
// Depois
Cliente cliente = resolvedorClienteFactory.para(usuarioLogado.getPerfil()).resolver(usuarioLogado, dto);
```

### 7 e 8. Observer + Adapter
```
concluirAgendamento ─ publishEvent(AgendamentoConcluidoEvent)
        ├─ AuditoriaAgendamentoListener  → log SLF4J
        └─ NotificacaoClienteListener → Notificador (interface)
                                              └─ AdaptadorEmailNotificador → ProvedorEmailSimulado.disparar(...)
```
Os ouvintes usam `@TransactionalEventListener(phase = AFTER_COMMIT)` e capturam exceções, então uma falha neles não impede a conclusão do agendamento nem o outro ouvinte.

## Limitações e padrões não aplicados

- **Criador (`Servico.adicionarProduto`)**: nenhum código do projeto instancia `ServicoProduto` hoje (os vínculos serviço-produto não têm endpoint de cadastro). O método foi criado, com a chave composta `ServicoProdutoId`, mas **ainda não tem chamador**. O uso real de `Cliente.adicionarPet` está no `PetService`. Efeito colateral: `adicionarPet` carrega a coleção `pets` do cliente (lazy) dentro da transação.
- **Adapter**: o provedor de e-mail é uma **simulação** (só escreve em log). Nenhum e-mail real é enviado e nenhuma dependência foi adicionada ao `pom.xml`.
- **Observer**: os ouvintes rodam de forma síncrona após o commit. Em produção, notificações externas costumam ser assíncronas (`@Async`), o que não foi feito para não aumentar a complexidade.
- **Strategy**: só existe a estratégia atual (soma). Nenhuma estratégia com desconto foi implementada, conforme combinado.
- **Alta Coesão**: `AgendamentoService` perdeu a resolução de cliente e o cálculo de preço, mas ainda reúne criar, listar, cancelar e concluir. A baixa de estoque dentro de `concluirAgendamento` foi mantida como estava.
- **Testes**: a pasta `petflow-api/src/test/` está no `.gitignore`; os testes novos foram adicionados com `git add -f`. Não há teste de integração (Spring + PostgreSQL), apenas testes unitários.
