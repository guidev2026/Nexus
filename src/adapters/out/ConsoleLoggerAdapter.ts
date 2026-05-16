import { ILogger } from "../../core/ports/out/ILogger";

export class ConsoleLoggerAdapter implements ILogger {
    info(mensagem: string): void {
        console.log(`ℹ️ [INFO] ${mensagem}`);
    }

    warn(mensagem: string): void {
        console.warn(`⚠️ [WARN] ${mensagem}`);
    }

    error(mensagem: string, erro?: Error): void {
        if (erro) {
            console.error(`❌ [ERROR] ${mensagem}`, erro);
        } else {
            console.error(`❌ [ERROR] ${mensagem}`);
        }
    }
}