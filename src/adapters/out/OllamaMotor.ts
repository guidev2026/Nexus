import { IMotorCognitivo } from "../../core/ports/out/IMotorCognitivo";

interface OllamaGenerateResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
}

export class OllamaMotor implements IMotorCognitivo {
    constructor(
        private readonly baseUrl: string,
        private readonly modelo: string
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
            throw new Error(
                `Não foi possível conectar ao servidor Ollama em ${this.baseUrl}. ` +
                    `Verifique se o serviço está em execução. Detalhes: ${(error as Error).message}`
            );
        }

        if (!response.ok) {
            throw new Error(
                `Ollama retornou status ${response.status}: ${response.statusText}`
            );
        }

        const data = (await response.json()) as OllamaGenerateResponse;
        return data.response;
    }
}