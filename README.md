# Aminus Agent v0.2.0 🧠

**Aminus** é um agente de IA autônomo projetado para ser leve, modular e extensível. Ele se conecta a modelos de linguagem locais (via [Ollama](https://ollama.com)) e oferece uma interface CLI interativa para conversação técnica com **persistência de histórico de mensagens**.

---

## ✨ Diferenciais Técnicos

- **🏛️ Arquitetura Hexagonal (Ports & Adapters)** — O núcleo de domínio (`src/core`) é totalmente isolado de detalhes de infraestrutura. As dependências externas (HTTP, CLI, sistema de arquivos) são injetadas via adaptadores.
- **🧹 Zero Dependências em Produção** — O `package.json` não possui nenhuma biblioteca externa em `dependencies`. Apenas TypeScript e Vitest como ferramentas de desenvolvimento.
- **🔌 Motor Cognitivo Plugável** — O Aminus define uma interface (`IMotorCognitivo`) que qualquer motor de IA pode implementar. Atualmente conta com o adaptador `OllamaMotor`, mas é trivial conectar outros provedores.
- **💾 Histórico Persistente** — As conversas são salvas automaticamente em arquivos JSON no diretório `./dados/`, garantindo contexto contínuo entre sessões.
- **🧪 Cobertura de Testes** — O core possui 100% de cobertura com testes unitários isolados (sem chamadas de rede ou disco reais), utilizando mocks manuais e Vitest.

## 🛠️ Tecnologias

| Tecnologia    | Versão  | Função                          |
|---------------|---------|---------------------------------|
| Node.js       | ≥ 18    | Runtime JavaScript              |
| TypeScript    | ^6.0    | Superset tipado                 |
| Vitest        | ^4.1    | Framework de testes unitários   |
| Ollama        | qualquer| Servidor de modelos LLM local   |

## 📦 Instalação

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd aminus

# Instale as dependências de desenvolvimento
npm install
```

## 🚀 Como Usar

### 1. Inicie o servidor Ollama

Certifique-se de que o [Ollama](https://ollama.com) está instalado e rodando:

```bash
# Inicie o servidor Ollama (caso não esteja rodando)
ollama serve

# Baixe um modelo (exemplo: qwen2.5-coder:1.5b)
ollama pull qwen2.5-coder:1.5b
```

### 2. Execute o CLI interativo

```bash
npm run dev
```

Você verá o prompt interativo:

```
🧠 Aminus v0.2.0 | Motor: qwen2.5-coder:1.5b | http://localhost:11434
📁 Sessão: default
Digite "/sair" para encerrar.

Você > Olá, Aminus!
Aminus > Olá! Como posso ajudar você hoje?
```

O histórico da conversa é salvo automaticamente no arquivo `./dados/memoria-default.json`.

### 3. Variáveis de Ambiente (opcional)

| Variável          | Padrão                  | Descrição                                    |
|-------------------|-------------------------|----------------------------------------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | URL base do servidor Ollama                  |
| `OLLAMA_MODELO`   | `qwen2.5-coder:1.5b`    | Nome do modelo LLM a ser usado               |
| `SESSAO_ID`       | `default`               | Identificador da sessão para o histórico     |

## 🧪 Testes

Execute a suíte completa de testes unitários:

```bash
npm test
```

Os testes cobrem o núcleo do agente (`AminusAgent`) com mocks manuais, garantindo que nenhuma chamada de rede ou acesso a disco real seja feito durante a execução dos testes.

```
✓ src/core/usecases/AminusAgent.spec.ts (5 tests)
  ✓ AminusAgent
    ✓ deve retornar a resposta do motor cognitivo no caminho feliz
    ✓ deve retornar mensagem de fallback quando o motor lançar um erro
    ✓ deve carregar o histórico e incluí-lo no prompt enviado ao motor
    ✓ deve salvar a nova interação no histórico após resposta do motor
    ✓ deve iniciar com histórico vazio quando não há mensagens anteriores
```

## 📁 Estrutura do Projeto

```
src/
├── core/                           # 📐 Domínio e Regras de Negócio
│   ├── models/
│   │   └── Mensagem.ts                  # Modelo de domínio: role + content
│   ├── ports/
│   │   └── out/
│   │       ├── IMotorCognitivo.ts       # Interface do motor (Porta de saída)
│   │       └── IMemoriaRepository.ts    # Interface de persistência (Porta de saída)
│   └── usecases/
│       ├── AminusAgent.ts               # Caso de uso principal
│       └── AminusAgent.spec.ts          # Testes unitários do core
├── adapters/                       # 🔌 Adaptadores de Infraestrutura
│   └── out/
│       ├── OllamaMotor.ts               # Implementação do motor Ollama
│       └── ArquivoMemoriaAdapter.ts     # Implementação da persistência em JSON
└── main.ts                         # 🚀 Ponto de entrada (CLI interativo)
```

### Camadas

- **`src/core`** — Contém as interfaces (Portas) e os casos de uso. **Não conhece** nada sobre HTTP, arquivos ou qualquer detalhe externo.
- **`src/adapters`** — Implementa as interfaces definidas no core. Aqui residem as chamadas HTTP para o Ollama, leitura/escrita de arquivos, etc.
- **`src/main.ts`** — Ponto de entrada: cria as instâncias, injeta as dependências manualmente e inicia o loop CLI.

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais informações.

---

<p align="center">Desenvolvido por <strong>Nexus Team</strong> — Sprint 0.2.0 ✅</p>