import { IMotorCognitivo } from "../ports/out/IMotorCognitivo";

export class AminusAgent {
    constructor(private readonly motor: IMotorCognitivo) { }

    public async interagir(mensagem: string): Promise<string> {
        const promptFormatado = `Você é o aminus um assistente tecnico, objetivo e altamente capacitado. responda de forma direta. \nUsuario: ${mensagem}\nAminus:`;

        try {
            const resposta = await this.motor.processar(promptFormatado);
            return resposta;
        } catch (error) {
            console.error("[Aminus]Falha na comunicação com o núcleo cognitivo:", error);
            return "Erro interno do servidor. Tente novamente mais tarde.";
        }
    }
}