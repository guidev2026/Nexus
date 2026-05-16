import { IMotorCognitivo } from "../ports/out/IMotorCognitivo";
import { IMemoriaRepository } from "../ports/out/IMemoriaRepository";
import { Mensagem } from "../models/Mensagem";

export class AminusAgent {
    constructor(
        private readonly motor: IMotorCognitivo,
        private readonly memoria: IMemoriaRepository,
    ) {}

    public async interagir(idSessao: string, mensagem: string): Promise<string> {
        const historico = await this.memoria.carregarHistorico(idSessao);
        const promptFormatado = this.montarPromptComHistorico(historico, mensagem);

        try {
            const resposta = await this.motor.processar(promptFormatado);
            await this.persistirInteracao(idSessao, historico, mensagem, resposta);
            return resposta;
        } catch (error) {
            console.error("[Aminus]Falha na comunicação com o núcleo cognitivo:", error);
            return "Erro interno do servidor. Tente novamente mais tarde.";
        }
    }

    private montarPromptComHistorico(historico: Mensagem[], mensagem: string): string {
        const linhas: string[] = [
            "Você é o Aminus, um assistente técnico, objetivo e altamente capacitado. Responda de forma direta.",
        ];

        for (const m of historico) {
            const rotulo = m.role === "user" ? "Usuário" : "Aminus";
            linhas.push(`${rotulo}: ${m.content}`);
        }

        linhas.push(`Usuário: ${mensagem}`);
        linhas.push("Aminus:");
        return linhas.join("\n");
    }

    private async persistirInteracao(
        idSessao: string,
        historico: Mensagem[],
        mensagemUsuario: string,
        resposta: string,
    ): Promise<void> {
        const novoHistorico: Mensagem[] = [
            ...historico,
            { role: "user", content: mensagemUsuario },
            { role: "assistant", content: resposta },
        ];
        await this.memoria.salvarHistorico(idSessao, novoHistorico);
    }
}
