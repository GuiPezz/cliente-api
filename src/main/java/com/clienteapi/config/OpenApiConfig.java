package com.clienteapi.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI clienteApiOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Cliente API - Empresa de Serviços")
                        .description("API RESTful para cadastro e gerenciamento de clientes.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipe AssistantHub")
                                .email("suporte@assistanthub.com.br")));
    }
}
