import { IMotorCognitivo } from "../../core/ports/out/IMotorCognitivo";
import { ILogger } from "../../core/ports/out/ILogger";

interface OllamaGenerateResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

export class OllamaMotor implements IMotorCognitivo {
    constructor(
        private readonly baseUrl: string,
        private readonly modelo: string,
        private readonly logger: ILogger,
    ) {}

    async processar(prompt: string): Promise<string> {
        const url = `${this.baseUrl}/api/generate`;

        const body = JSON.stringify({
            model: this.modelo,
            prompt,
            stream: false,
        });

        let response: Response;
        try {
            response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
            });
        } catch (error) {
            const erro = error instanceof Error ? error : new Error(String(error));
            this.logger.error(
                `Falha de conexão com Ollama em ${this.baseUrl}. Verifique se o serviço está em execução.`,
                erro,
            );
            throw new Error(
                `Não foi possível conectar ao servidor Ollama em ${this.baseUrl}. ` +
                    `Verifique se o serviço está em execução. Detalhes: ${erro.message}`
            );
        }

        if (!response.ok) {
            const statusText = await response.text().catch(() => response.statusText);
            this.logger.error(
                `Ollama retornou HTTP ${response.status} para ${url}`,
                new Error(statusText),
            );
            throw new Error(
                `Ollama retornou status ${response.status}: ${statusText}`
            );
        }

        const data = (await response.json()) as OllamaGenerateResponse;
        return data.response;
    }
}