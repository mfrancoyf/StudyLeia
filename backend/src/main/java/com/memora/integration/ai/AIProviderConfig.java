package com.memora.integration.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Resolve, em tempo de inicialização, qual implementação de
 * AIProvider deve ser injetada nos Services que dependem da
 * interface (AIQuizGeneratorService, AIStudyPlanGeneratorService).
 *
 * Cada implementação concreta (MockAIProvider, GeminiAIProvider,
 * GroqAIProvider, OpenRouterAIProvider) é registrada como um
 * @Component com um nome de bean qualificado ("MOCK", "GEMINI",
 * "GROQ", "OPENROUTER"). Esta classe apenas busca, pelo nome, o bean
 * correspondente ao valor configurado em `memora.ia.provider` e o
 * expõe como o @Primary AIProvider do contexto.
 *
 * Essa indireção é o que permite trocar de provedor só editando o
 * application.yml — nenhuma outra classe do sistema precisa mudar.
 */
@Slf4j
@Configuration
public class AIProviderConfig {

    @Bean
    @Primary
    public AIProvider aiProviderAtivo(
            ApplicationContext contexto,
            @Value("${memora.ia.provider}") String providerConfigurado
    ) {
        String chave = providerConfigurado == null ? "MOCK" : providerConfigurado.trim().toUpperCase();

        if (!contexto.containsBean(chave)) {
            log.warn("Provider de IA '{}' não reconhecido. Usando MOCK como fallback.", chave);
            chave = "MOCK";
        }

        AIProvider provider = (AIProvider) contexto.getBean(chave);
        log.info("Camada de IA inicializada com o provider: {}", provider.nomeProvedor());
        return provider;
    }
}
