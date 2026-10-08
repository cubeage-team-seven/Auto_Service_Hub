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

## Frontend integration

Run the Vite application from the sibling `Auto_Service_Hub_Frontend` directory.
Its development server proxies `/api` requests to this backend on port 8080.
Customers are CRM records used by administrators, owners, and staff for workshop
operations. Customer login, self-registration, portal endpoints, and customer
account provisioning are not supported.

## Administrator and staff account workflow

Owner/staff applicants use **Request platform access** from the module selection
screen. Requests are stored as pending and do not create login accounts.
Administrators approve or reject them from `/admin`; approval assigns only the
requested non-admin role and creates a BCrypt-hashed account. Administrators can
also create owner/staff accounts directly. The administrator can create and edit
CRM customer profiles; other workshop roles can read customer records for
operational workflows. One customer profile can have multiple vehicles.

To establish the first administrator, set `ADMIN_BOOTSTRAP_USERNAME`,
`ADMIN_BOOTSTRAP_EMAIL`, and `ADMIN_BOOTSTRAP_PASSWORD` in the backend process
environment before the first startup. Use a unique username/email and a random
password of at least 16 characters; optionally set `ADMIN_BOOTSTRAP_FULL_NAME`.
The bootstrap creates an administrator only when no administrator account
exists, and never resets an existing account. Remove the bootstrap secret from
the deployment environment after successful initialization. There is no public
admin registration or reset endpoint.

For an existing production database, first inspect and resolve duplicate
non-null usernames/emails in `users` without deleting or merging records
automatically. Apply
`src/main/resources/db/migration/V2__admin_access_workflows.sql` once for admin
and access-request tables, then apply
`src/main/resources/db/migration/V3__remove_customer_portal.sql` to disable any
legacy customer login accounts and remove the portal-only customer email index.
The V3 script preserves user rows and customer records. Development uses
Hibernate schema update; production requires applying these SQL files manually.

## External integrations

Core workshop, inventory, billing, reporting, and customer APIs persist through
the configured database. AI provider availability and messaging (email, SMS,
WhatsApp) still depend on provider configuration; the frontend reports API or
provider errors rather than substituting sample data.
