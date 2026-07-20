# MiniMarket Plus - EFT Semana 9

Proyecto backend desarrollado para la Evaluación Final Transversal de Desarrollo Backend II.

## Funcionalidades implementadas

- Backend REST para MiniMarket Plus.
- Controladores para productos, carrito, inventario, usuarios, ventas, categorías y detalle de ventas.
- Seguridad con Spring Security.
- Autenticación con JWT mediante `/api/auth/login`.
- Autorización basada en roles: `ADMIN`, `CAJERO` y `CLIENTE`.
- Documentación OpenAPI disponible en Swagger UI.
- Respuestas con enlaces HATEOAS usando `EntityModel`, `CollectionModel`, `linkTo` y `methodOn`.
- Pruebas unitarias con JUnit, Mockito, MockMvc y Spring Security Test.
- Reporte de cobertura con JaCoCo.
- Base de datos H2 en memoria con datos iniciales.

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | ADMIN |
| cajero | cajero123 | CAJERO |
| cliente | cliente123 | CLIENTE |

## Ejecutar el proyecto

En Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

En macOS/Linux:

```bash
./mvnw spring-boot:run
```

## Ejecutar pruebas

```powershell
.\mvnw.cmd clean test
```

El reporte de cobertura queda en:

```text
target/site/jacoco/index.html
```

## Swagger / OpenAPI

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

Especificación OpenAPI JSON:

```text
http://localhost:8080/v3/api-docs
```

## Obtener token JWT

Endpoint:

```http
POST http://localhost:8080/api/auth/login
```

Body de ejemplo:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

La respuesta entrega un token. Para consumir endpoints protegidos, usar:

```text
Authorization: Bearer <token>
```

También se mantiene soporte de Basic Auth para facilitar pruebas rápidas en Postman o Swagger.

## Endpoints principales

- `GET /api/productos`
- `POST /api/productos` - requiere ADMIN
- `PUT /api/productos/{id}` - requiere ADMIN
- `DELETE /api/productos/{id}` - requiere ADMIN
- `GET /api/inventario` - requiere ADMIN
- `POST /api/inventario` - requiere ADMIN
- `GET /api/ventas` - requiere ADMIN o CAJERO
- `POST /api/ventas` - requiere ADMIN o CAJERO
- `GET /api/usuarios` - requiere ADMIN
- `POST /api/usuarios` - requiere ADMIN
- `GET /api/carrito` - requiere autenticación
- `POST /api/carrito` - requiere autenticación

## Evidencias sugeridas para el informe/video

- `pom.xml` mostrando dependencias de Spring Security, OpenAPI, HATEOAS, JUnit y JaCoCo.
- `SecurityConfig.java` mostrando reglas por rol y filtro JWT.
- `AuthController.java` mostrando login JWT.
- `JwtUtil.java` mostrando generación y validación del token.
- Swagger UI abierto.
- `/v3/api-docs` abierto.
- Endpoint `GET /api/productos` mostrando `_links` de HATEOAS.
- Terminal con `BUILD SUCCESS` luego de `clean test`.
- Reporte JaCoCo en `target/site/jacoco/index.html`.
