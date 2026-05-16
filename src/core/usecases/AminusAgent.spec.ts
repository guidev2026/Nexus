import { describe, it, expect, vi } from "vitest";
import { AminusAgent } from "./AminusAgent";
import { IMotorCognitivo } from "../ports/out/IMotorCognitivo";
import { IMemoriaRepository } from "../ports/out/IMemoriaRepository";
import { Mensagem } from "../models/Mensagem";

function criarMotorMock(resposta?: string): IMotorCognitivo {
    return {
        processar: vi.fn().mockResolvedValue(resposta ?? "Resposta mockada do LLM"),
    };
}

function criarMemoriaMock(historico?: Mensagem[]): IMemoriaRepository {
    return {
        carregarHistorico: vi.fn().mockResolvedValue(historico ?? []),
        salvarHistorico: vi.fn().mockResolvedValue(undefined),
    };
}

describe("AminusAgent", () => {
    it("deve retornar a resposta do motor cognitivo no caminho feliz", async () => {
        const motorMock = criarMotorMock("Olá! Como posso ajudar?");
        const memoriaMock = criarMemoriaMock();
        const agente = new AminusAgent(motorMock, memoriaMock);

        const resposta = await agente.interagir("sessao-1", "Qual é a capital do Brasil?");

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
        const memoriaMock = criarMemoriaMock();
        const agente = new AminusAgent(motorComErro, memoriaMock);

        const resposta = await agente.interagir("sessao-1", "Teste de erro");

        expect(resposta).toBe("Erro interno do servidor. Tente novamente mais tarde.");
        expect(motorComErro.processar).toHaveBeenCalledTimes(1);
    });

    it("deve carregar o histórico e incluí-lo no prompt enviado ao motor", async () => {
        const historicoAnterior: Mensagem[] = [
            { role: "user", content: "Qual é a capital do Brasil?" },
            { role: "assistant", content: "Brasília." },
        ];
        const motorMock = criarMotorMock("Resposta com contexto");
        const memoriaMock = criarMemoriaMock(historicoAnterior);
        const agente = new AminusAgent(motorMock, memoriaMock);

        await agente.interagir("sessao-1", "E a da Argentina?");

        const promptChamado = (motorMock.processar as ReturnType<typeof vi.fn>).mock
            .calls[0][0] as string;
        expect(promptChamado).toContain("Qual é a capital do Brasil?");
        expect(promptChamado).toContain("Brasília.");
        expect(promptChamado).toContain("E a da Argentina?");
    });

    it("deve salvar a nova interação no histórico após resposta do motor", async () => {
        const historicoAnterior: Mensagem[] = [
            { role: "user", content: "Qual é a capital do Brasil?" },
            { role: "assistant", content: "Brasília." },
        ];
        const motorMock = criarMotorMock("Buenos Aires.");
        const memoriaMock = criarMemoriaMock(historicoAnterior);
        const agente = new AminusAgent(motorMock, memoriaMock);

        await agente.interagir("sessao-1", "E a da Argentina?");

        expect(memoriaMock.salvarHistorico).toHaveBeenCalledTimes(1);
        const [idSessaoSalva, historicoSalvo] = (
            memoriaMock.salvarHistorico as ReturnType<typeof vi.fn>
        ).mock.calls[0] as [string, Mensagem[]];

        expect(idSessaoSalva).toBe("sessao-1");
        expect(historicoSalvo).toEqual([
            { role: "user", content: "Qual é a capital do Brasil?" },
            { role: "assistant", content: "Brasília." },
            { role: "user", content: "E a da Argentina?" },
            { role: "assistant", content: "Buenos Aires." },
        ]);
    });

    it("deve iniciar com histórico vazio quando não há mensagens anteriores", async () => {
        const motorMock = criarMotorMock("Resposta sem histórico");
        const memoriaMock = criarMemoriaMock([]);
        const agente = new AminusAgent(motorMock, memoriaMock);

        await agente.interagir("sessao-1", "Primeira mensagem");

        const promptChamado = (motorMock.processar as ReturnType<typeof vi.fn>).mock
            .calls[0][0] as string;
        expect(promptChamado).toContain("Primeira mensagem");

        const ocorrenciasUsuario = promptChamado.match(/Usuário:/g)?.length ?? 0;
        expect(ocorrenciasUsuario).toBe(1);
        expect(promptChamado).toContain("Usuário: Primeira mensagem");
    });
});
