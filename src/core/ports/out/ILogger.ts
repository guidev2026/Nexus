export interface ILogger {
    info(mensagem: string): void;
    warn(mensagem: string): void;
    error(mensagem: string, erro?: Error): void;
}