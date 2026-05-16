import { describe, it, expect, vi } from "vitest";
import { AminusAgent } from "./AminusAgent";
import { IMotorCognitivo } from "../ports/out/IMotorCognitivo";

function criarMotorMock(resposta?: string): IMotorCognitivo {
    return {
        processar: vi.fn().mockResolvedValue(resposta ?? "Resposta mockada do LLM"),
    };
}

describe("AminusAgent", () => {
    it("deve retornar a resposta do motor cognitivo no caminho feliz", async () => {
        const motorMock = criarMotorMock("Olá! Como posso ajudar?");
        const agente = new AminusAgent(motorMock);

        const resposta = await agente.interagir("Qual é a capital do Brasil?");

        expect(resposta).toBe("Olá! Como posso ajudar?");
        expect(motorMock.processar).toHaveBeenCalledTimes(1);
        expect(motorMock.processar).toHaveBeenCalledWith(
            expect.stringContaining("Qual é a capital do Brasil?")
        );
    });

    it("deve retornar mensagem de fallback quando o motor lançar um erro", async () => {
        const motorComErro: IMotorCognitivo = {
            processar: vi.fn().mockRejectedValue(new Error("Ollama offline")),
        };
        const agente = new AminusAgent(motorComErro);

        const resposta = await agente.interagir("Teste de erro");

        expect(resposta).toBe("Erro interno do servidor. Tente novamente mais tarde.");
        expect(motorComErro.processar).toHaveBeenCalledTimes(1);
    });
});