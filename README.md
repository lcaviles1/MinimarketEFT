# MiniMarket Plus

Backend desarrollado para la Evaluación Final Transversal de **Desarrollo Backend II (PBY2202)**.

La aplicación centraliza la gestión de productos, inventario, usuarios, carritos y ventas de MiniMarket Plus mediante una API REST segura, documentada y navegable.

## Funcionalidades

- Gestión de productos y categorías.
- Registro de movimientos de inventario.
- Administración de usuarios y roles.
- Gestión de carritos de compra.
- Registro de ventas y sus detalles.
- Autenticación mediante JWT.
- Autorización basada en roles.
- Documentación interactiva con OpenAPI.
- Navegación entre recursos mediante HATEOAS.
- Pruebas automatizadas y cobertura con JaCoCo.

## Arquitectura

El proyecto utiliza una arquitectura organizada por responsabilidades:

- `controller`: exposición de endpoints REST.
- `service`: operaciones y lógica de aplicación.
- `repository`: acceso a datos mediante Spring Data JPA.
- `entity`: representación del modelo persistente.
- `security`: autenticación JWT y autorización.
- `config`: configuración general, OpenAPI y datos iniciales.

## Tecnologías

- Java 17
- Spring Boot 3.4.1
- Spring Web
- Spring Data JPA
- Spring Security
- JWT con firma HMAC-SHA256
- Spring HATEOAS
- OpenAPI / Swagger UI
- Base de datos H2
- JUnit 5, Mockito y MockMvc
- JaCoCo
- Maven

## Ejecución local

En macOS o Linux:

```bash
./mvnw spring-boot:run
```

En Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

La aplicación queda disponible en:

```text
http://localhost:8080
```

## Usuarios de demostración

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `admin123` | ADMIN |
| `cajero` | `cajero123` | CAJERO |
| `cliente` | `cliente123` | CLIENTE |

## Autenticación

Para obtener un token JWT:

```http
POST /api/auth/login
```

Ejemplo de solicitud:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Las solicitudes protegidas deben incluir el encabezado:

```text
Authorization: Bearer <token>
```

## Endpoints principales

| Recurso | Ruta base | Acceso |
|---|---|---|
| Autenticación | `/api/auth` | Público |
| Productos | `/api/productos` | Lectura autenticada; escritura ADMIN |
| Categorías | `/api/categorias` | Autenticado |
| Inventario | `/api/inventario` | ADMIN |
| Carrito | `/api/carrito` | Autenticado |
| Usuarios | `/api/usuarios` | ADMIN |
| Ventas | `/api/ventas` | ADMIN o CAJERO |
| Detalle de ventas | `/api/detalle-ventas` | Autenticado |

## OpenAPI y HATEOAS

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

Especificación OpenAPI:

```text
http://localhost:8080/v3/api-docs
```

Las respuestas principales incorporan enlaces HATEOAS para facilitar la navegación entre productos, inventario, carrito y ventas.

## Pruebas

El proyecto contiene 18 pruebas automatizadas relacionadas con autenticación, JWT, autorización por roles, controladores y carga del contexto.

Para ejecutarlas:

```bash
./mvnw clean test
```

El reporte de cobertura se genera en:

```text
target/site/jacoco/index.html
```

## Documentación

El informe técnico de la Evaluación Final Transversal se encuentra en la carpeta `documentacion`.

---

Proyecto académico desarrollado para Duoc UC.
