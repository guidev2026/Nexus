import { IMotorCognitivo } from "../ports/out/IMotorCognitivo";
import { IMemoriaRepository } from "../ports/out/IMemoriaRepository";
import { ILogger } from "../ports/out/ILogger";
import { Mensagem } from "../models/Mensagem";

const INSTRUCAO_SISTEMA =
    "Você é o Aminus, um assistente técnico, objetivo e altamente capacitado. Responda de forma direta.";

const INSTRUCAO_REFORCO = "Lembre-se: Você é o Aminus. Seja seco e direto.";

const FEW_SHOT_EXAMPLES = [
    "Usuário: Quanto é 10x5?\nAminus: 50.",
    "Usuário: Qual a capital da França?\nAminus: Paris.",
];

const JANELA_HISTORICO = 6;

export class AminusAgent {
    constructor(
        private readonly motor: IMotorCognitivo,
        private readonly memoria: IMemoriaRepository,
        private readonly logger: ILogger,
    ) {}

    public async interagir(idSessao: string, mensagem: string): Promise<string> {
        const historico = await this.memoria.carregarHistorico(idSessao);
        this.logger.info(`Sessão '${idSessao}' carregada com ${historico.length} mensagens`);

        const promptFormatado = this.montarPromptComHistorico(historico, mensagem);

        try {
            this.logger.info("Iniciando chamada ao motor cognitivo...");
            const resposta = await this.motor.processar(promptFormatado);
            await this.persistirInteracao(idSessao, historico, mensagem, resposta);
            return resposta;
        } catch (error) {
            const erro = error instanceof Error ? error : new Error(String(error));
            this.logger.error("Falha na comunicação com o núcleo cognitivo", erro);
            return "Erro interno do servidor. Tente novamente mais tarde.";
        }
    }

    private montarPromptComHistorico(historico: Mensagem[], mensagem: string): string {
        const linhas: string[] = [INSTRUCAO_SISTEMA, ...FEW_SHOT_EXAMPLES, ""];

        // Janela deslizante: pega apenas as últimas N mensagens
        const recorte = historico.slice(-JANELA_HISTORICO);

        for (const m of recorte) {
            const rotulo = m.role === "user" ? "Usuário" : "Aminus";
            linhas.push(`${rotulo}: ${m.content}`);
        }

        linhas.push("");
        linhas.push(INSTRUCAO_REFORCO);
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
        try {
            const novoHistorico: Mensagem[] = [
                ...historico,
                { role: "user", content: mensagemUsuario },
                { role: "assistant", content: resposta },
            ];
            await this.memoria.salvarHistorico(idSessao, novoHistorico);
            this.logger.info(`Histórico salvo para sessão '${idSessao}'`);
        } catch (error) {
            const erro = error instanceof Error ? error : new Error(String(error));
            this.logger.error(`Erro ao persistir histórico da sessão '${idSessao}'`, erro);
        }
    }
}