import { Mensagem } from "../../models/Mensagem";

export interface IMemoriaRepository {
    salvarHistorico(idSessao: string, mensagens: Mensagem[]): Promise<void>;
    carregarHistorico(idSessao: string): Promise<Mensagem[]>;
}