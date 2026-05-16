import * as fs from "fs";
import * as path from "path";
import { IMemoriaRepository } from "../../core/ports/out/IMemoriaRepository";
import { Mensagem } from "../../core/models/Mensagem";

export class ArquivoMemoriaAdapter implements IMemoriaRepository {
    private readonly diretorio: string;

    constructor(diretorio?: string) {
        this.diretorio = diretorio ?? path.resolve(process.cwd(), "dados");
    }

    async salvarHistorico(idSessao: string, mensagens: Mensagem[]): Promise<void> {
        await fs.promises.mkdir(this.diretorio, { recursive: true });
        const caminho = this.obterCaminhoArquivo(idSessao);
        const conteudo = JSON.stringify(mensagens, null, 2);
        await fs.promises.writeFile(caminho, conteudo, "utf-8");
    }

    async carregarHistorico(idSessao: string): Promise<Mensagem[]> {
        const caminho = this.obterCaminhoArquivo(idSessao);

        try {
            const conteudo = await fs.promises.readFile(caminho, "utf-8");
            const dados = JSON.parse(conteudo) as unknown[];

            if (!Array.isArray(dados)) {
                return [];
            }

            return dados.filter(
                (item): item is Mensagem =>
                    typeof item === "object" &&
                    item !== null &&
                    (item as Mensagem).role !== undefined &&
                    (item as Mensagem).content !== undefined,
            );
        } catch (erro: unknown) {
            if ((erro as NodeJS.ErrnoException).code === "ENOENT") {
                return [];
            }
            throw erro;
        }
    }

    private obterCaminhoArquivo(idSessao: string): string {
        return path.join(this.diretorio, `memoria-${idSessao}.json`);
    }
}