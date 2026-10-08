# Auto Service Hub frontend

React and Vite frontend for the Spring Boot API in `../Auto_Service_Hub_Backend`.

## Run locally

1. Start MySQL and configure the backend's database and JWT environment variables as described in the backend README.
2. Start the API from `Auto_Service_Hub_Backend` with `mvn spring-boot:run`; it listens on `http://localhost:8080`.
3. In this directory, run `npm ci` and `npm run dev`.
4. Open the Vite URL shown in the terminal and sign in with an account provisioned in the backend.

Vite proxies `/api` to `http://localhost:8080`. Set `VITE_API_PROXY_TARGET` when the backend is running elsewhere. For a directly reachable API, set `VITE_API_BASE_URL` to its `/api/v1` base URL.

Owner and staff applicants can submit an access request from the module screen. Requests do not create accounts until an administrator approves them. The first administrator is initialized once through the backend bootstrap environment variables described in the backend README; public administrator sign-up is not available.

Customers are CRM records only; they do not sign in, self-register, or use this application. Administrators maintain customer profiles, while workshop staff and owners use customer records for operational workflows. Customer records may have multiple vehicles and related service history.
