import { OllamaMotor } from "./adapters/out/OllamaMotor";
import { ArquivoMemoriaAdapter } from "./adapters/out/ArquivoMemoriaAdapter";
import { ConsoleLoggerAdapter } from "./adapters/out/ConsoleLoggerAdapter";
import { AminusAgent } from "./core/usecases/AminusAgent";
import * as readline from "readline";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODELO = process.env.OLLAMA_MODELO ?? "qwen2.5-coder:1.5b";
const SESSAO_ID = process.env.SESSAO_ID ?? "default";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function perguntar(pergunta: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(pergunta, resolve);
    });
}

async function main() {
    const logger = new ConsoleLoggerAdapter();
    const motor = new OllamaMotor(OLLAMA_BASE_URL, OLLAMA_MODELO, logger);
    const memoria = new ArquivoMemoriaAdapter();
    const agente = new AminusAgent(motor, memoria, logger);

    logger.info(`Aminus v0.2.0 | Motor: ${OLLAMA_MODELO} | ${OLLAMA_BASE_URL}`);
    logger.info(`Sessão: ${SESSAO_ID}`);
    console.log('Digite "/sair" para encerrar.\n');

    let ativo = true;
    while (ativo) {
        const entrada = await perguntar("Você > ");

        if (entrada.trim().toLowerCase() === "/sair") {
            ativo = false;
            continue;
        }

        try {
            const resposta = await agente.interagir(SESSAO_ID, entrada);
            console.log(`Aminus > ${resposta}\n`);
        } catch (error) {
            logger.error("Erro inesperado no loop principal", error as Error);
        }
    }

    logger.info("Encerrando Aminus. Até mais!");
    rl.close();
}

main().catch((error) => {
    const logger = new ConsoleLoggerAdapter();
    logger.error("Falha na inicialização", error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
});