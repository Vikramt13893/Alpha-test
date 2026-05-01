package com.alpha.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI alphaOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Alpha API")
                        .description("Canonical contract lives in repo root: openapi/openapi.yaml — use Bearer JWT for protected routes.")
                        .version("0.3.0"))
                .components(new Components().addSecuritySchemes("bearer-jwt",
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Paste accessToken from POST /api/auth/login")));
    }
}
