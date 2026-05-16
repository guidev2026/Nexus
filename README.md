# Aminus Agent v0.1.0 🧠

**Aminus** é um agente de IA autônomo projetado para ser leve, modular e extensível. Ele se conecta a modelos de linguagem locais (via [Ollama](https://ollama.com)) e oferece uma interface CLI interativa para conversação técnica.

---

## ✨ Diferenciais Técnicos

- **🏛️ Arquitetura Hexagonal (Ports & Adapters)** — O núcleo de domínio (`src/core`) é totalmente isolado de detalhes de infraestrutura. As dependências externas (HTTP, CLI, banco de dados) são injetadas via adaptadores.
- **🧹 Zero Dependências em Produção** — O `package.json` não possui nenhuma biblioteca externa em `dependencies`. Apenas TypeScript e Vitest como ferramentas de desenvolvimento.
- **🔌 Motor Cognitivo Plugável** — O Aminus define uma interface (`IMotorCognitivo`) que qualquer motor de IA pode implementar. Atualmente conta com o adaptador `OllamaMotor`, mas é trivial conectar outros provedores.
- **🧪 Cobertura de Testes** — O core possui 100% de cobertura com testes unitários isolados (sem chamadas de rede reais), utilizando mocks manuais e Vitest.

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

# Baixe um modelo (exemplo: llama3)
ollama pull llama3
```

### 2. Execute o CLI interativo

```bash
npm run dev
```

Você verá o prompt interativo:

```
🧠 Aminus v0.1.0 | Motor: llama3 | http://localhost:11434
Digite "/sair" para encerrar.

Você > Olá, Aminus!
Aminus > Olá! Como posso ajudar você hoje?
```

### 3. Variáveis de Ambiente (opcional)

| Variável          | Padrão                  | Descrição                       |
|-------------------|-------------------------|---------------------------------|
| `OLLAMA_BASE_URL` | `http://localhost:11434` | URL base do servidor Ollama     |
| `OLLAMA_MODELO`   | `llama3`                | Nome do modelo LLM a ser usado  |

## 🧪 Testes

Execute a suíte completa de testes unitários:

```bash
npm test
```

Os testes cobrem o núcleo do agente (`AminusAgent`) com mocks manuais, garantindo que nenhuma chamada de rede real seja feita durante a execução dos testes.

## 📁 Estrutura do Projeto

```
src/
├── core/                       # 📐 Domínio e Regras de Negócio
│   ├── ports/
│   │   └── out/
│   │       └── IMotorCognitivo.ts   # Interface do motor (Porta de saída)
│   └── usecases/
│       ├── AminusAgent.ts           # Caso de uso principal
│       └── AminusAgent.spec.ts      # Testes unitários do core
├── adapters/                   # 🔌 Adaptadores de Infraestrutura
│   └── out/
│       └── OllamaMotor.ts           # Implementação do motor Ollama
└── main.ts                     # 🚀 Ponto de entrada (CLI interativo)
```

### Camadas

- **`src/core`** — Contém as interfaces (Portas) e os casos de uso. **Não conhece** nada sobre HTTP, arquivos ou qualquer detalhe externo.
- **`src/adapters`** — Implementa as interfaces definidas no core. Aqui residem as chamadas HTTP para o Ollama, leitura de arquivos, etc.
- **`src/main.ts`** — Ponto de entrada: cria as instâncias, injeta as dependências manualmente e inicia o loop CLI.

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais informações.

---

<p align="center">Desenvolvido por <strong>Nexus Team</strong> — Sprint 0.1.0 ✅</p>