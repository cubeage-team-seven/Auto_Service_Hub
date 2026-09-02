# Auto Service HUB CRM — Backend

Java + Spring Boot + MySQL backend for the Auto Service HUB CRM, scaffolded from
`Auto Service HUB — CRM SRS v1.0` (sections 7, 8, 9, 20.1) to match the React +
Tailwind frontend in the linked Figma Make project.

## Stack
- Java 17, Spring Boot 3.3 (Web, Validation, Data JPA, Security, Actuator)
- MySQL 8.x via Spring Data JPA / Hibernate
- JWT auth (jjwt) + Spring Security RBAC
- springdoc-openapi (Swagger UI at `/swagger-ui.html`)
- MapStruct + Lombok

## Folder structure
```
src/main/java/com/autoservicehub
├── AutoServiceHubApplication.java
├── config/        SecurityConfig, CorsConfig, OpenApiConfig
├── controller/     REST controllers (one per SRS module, plus Auth/Report/AI)
├── dto/            Request/Response DTOs, ApiResponse/ApiErrorResponse envelopes
├── entity/         JPA entities (SRS 8.2 high-level entities)
├── repository/     Spring Data JPA repositories
├── service/        Service interfaces
│   └── impl/       Service implementations
├── security/       JwtTokenProvider, JwtAuthenticationFilter, CustomUserDetailsService
├── exception/      GlobalExceptionHandler + custom exceptions
├── mapper/         MapStruct DTO<->Entity mappers
├── ai/             Provider-independent AI integration boundary (SRS 5)
└── util/           Shared constants (workflow states, roles)

src/main/resources
├── application.yml, application-dev.yml, application-prod.yml
└── db/migration/   Versioned SQL migrations (Flyway-style placeholder)
```

## Getting started
1. Set env vars: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `CORS_ORIGINS`.
2. `mvn spring-boot:run` (dev profile: `-Dspring-boot.run.profiles=dev`).
3. Swagger UI: `http://localhost:8080/swagger-ui.html`.

## What's stubbed vs. what needs work
- Entities match SRS 8.2/8.3 field lists; confirm exact types/nullability before
  freezing the ERD (SRS 25, Open Questions).
- DTOs, service impls and mappers are scaffolded with `TODO`s — fill in field
  mapping once the API contract per module is confirmed (SRS 9).
- `ai/` package defines the provider-independent boundary for the six AI
  features (SRS 5); wire a real `AiProviderClient` once a provider is chosen
  (SRS 25, Q8).
- `NotificationServiceImpl` needs real WhatsApp/Email/SMS provider integration
  (SRS 18, 25 Q3).
- Role-to-authority mapping in `CustomUserDetailsService` is a placeholder —
  wire it to the `roles`/`user_roles` tables once RBAC data model is implemented.
