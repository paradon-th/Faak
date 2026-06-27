# Faak Project - Agent Rules

The following rules MUST be strictly followed by all agents working on this project:

## 1. Architecture (Clean Architecture)
- **Backend (.NET):** MUST be structured strictly following Clean Architecture principles. Separate the project into clearly defined layers: `Domain` (Entities, Interfaces), `Application` (Use Cases, Services), `Infrastructure` (Database context, external integrations), and `Presentation` (API Controllers).
- **Frontend (Next.js):** MUST follow a clean separation of concerns. Keep business logic separate from UI components. Use custom hooks, services, and clear state management.

## 2. Continuous Integration (CI)
- **CI is Mandatory:** Every component and layer MUST have a CI process configured (e.g., GitHub Actions).
- Code changes must be structured in a way that allows automated building, testing, and linting.

## 3. Strict Execution (No Guessing)
- **Do NOT guess:** Never invent requirements, design choices, or assume the user's intent if it is not explicitly provided.
- **Ask for clarification:** If any requirement, architectural decision, or code logic is ambiguous or missing, you MUST stop and ask the user for clarification before proceeding.

## 4. Tech Stack & Libraries
- **Frontend (Next.js):** MUST use **shadcn/ui** for UI components and **lucide-react** for icons.
- **Type Safety:** STRICT Type safety is required. **Do NOT use `any`** in TypeScript.
- **Backend (.NET):** MUST use **Entity Framework Core (EF Core)** with the **Code-First** approach.

## 5. Coding Standards
- **Clean & Readable Code:** Focus on writing code that is clean, readable, and self-documenting.
- **Minimal Comments:** Avoid excessive or unnecessary comments. Only comment when the logic is highly complex or counter-intuitive. Let the code speak for itself.

## 6. Testing Requirements
- **Test Coverage:** All code MUST maintain a minimum test coverage of **> 90%**.
- **End-to-End (E2E) Testing:** MUST include automated UI testing (e.g., Playwright) that opens a real web browser to simulate and verify real user interactions.
