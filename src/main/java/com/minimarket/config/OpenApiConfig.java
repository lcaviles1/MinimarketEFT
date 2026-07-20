package com.minimarket.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.security.SecuritySchemes;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "MiniMarket Plus API - EFT Semana 9",
                version = "1.0",
                description = "Backend MiniMarket Plus con seguridad por roles, JWT, pruebas unitarias, OpenAPI y HATEOAS.",
                contact = @Contact(name = "Equipo Desarrollo Backend II")
        )
)
@SecuritySchemes({
        @SecurityScheme(
                name = "bearerAuth",
                type = SecuritySchemeType.HTTP,
                scheme = "bearer",
                bearerFormat = "JWT"
        ),
        @SecurityScheme(
                name = "basicAuth",
                type = SecuritySchemeType.HTTP,
                scheme = "basic"
        )
})
public class OpenApiConfig {
}
