import { OllamaMotor } from "./adapters/out/OllamaMotor";
import { AminusAgent } from "./core/usecases/AminusAgent";
import * as readline from "readline";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const OLLAMA_MODELO = process.env.OLLAMA_MODELO ?? "llama3";

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
    const motor = new OllamaMotor(OLLAMA_BASE_URL, OLLAMA_MODELO);
    const agente = new AminusAgent(motor);

    console.log(`🧠 Aminus v0.1.0 | Motor: ${OLLAMA_MODELO} | ${OLLAMA_BASE_URL}`);
    console.log('Digite "/sair" para encerrar.\n');

    let ativo = true;
    while (ativo) {
        const entrada = await perguntar("Você > ");

        if (entrada.trim().toLowerCase() === "/sair") {
            ativo = false;
            continue;
        }

        try {
            const resposta = await agente.interagir(entrada);
            console.log(`Aminus > ${resposta}\n`);
        } catch (error) {
            console.error(`Erro inesperado: ${(error as Error).message}\n`);
        }
    }

    console.log("Encerrando Aminus. Até mais!");
    rl.close();
}

main().catch((error) => {
    console.error("Falha na inicialização:", error);
    process.exit(1);
});