export interface IMotorCognitivo {
    /**
     * Recebe um prommpt e retorna a resposta gerada pelo LLM.
     * @param prompt O texto de entrada que deseja enviar para o modelo.
     * @returns A resposta gerada pelo modelo.
     */
    processar(prompt: string): Promise<string>;
}