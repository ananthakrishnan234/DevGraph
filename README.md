# DevGraph

**Developer Knowledge Graph powered by CognoDB**

DevGraph is a full-stack web application that lets you explore how developers, their skills, the projects they've built, and the technologies behind those projects are all connected — as a graph, not as rows in a table.

🔗 **Live Demo:** [https://dev-graph-sable.vercel.app/](https://dev-graph-sable.vercel.app/)
📦 **Repository:** [https://github.com/ananthakrishnan234/DevGraph](https://github.com/ananthakrishnan234/DevGraph)

> **Note on cold starts:** the backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idle time can take 30–50 seconds to wake up — please wait for the initial load before assuming something's broken.

---

## Table of Contents

- [Why a Graph Database?](#why-a-graph-database)
- [Data Model](#data-model)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Cypher Queries](#cypher-queries)
- [Project Structure](#project-structure)
- [Setup & Run Locally](#setup--run-locally)
- [Deployment](#deployment)
- [Error Handling](#error-handling)
- [Screenshots](#screenshots)

---

## Why a Graph Database?

A developer knowledge network is naturally a graph, not a set of tables.

A developer can have many skills, build multiple projects, and those projects use technologies that themselves require additional skills. Skills are also related to each other — knowing Java naturally connects to Spring Boot, which connects to REST APIs, which connects to React on the frontend side.

```
Developer -[:HAS_SKILL]-> Skill
Developer -[:BUILT]-> Project -[:USES]-> Technology
Project -[:REQUIRES]-> Skill
Skill -[:RELATED_TO]-> Skill
```

In a relational database, answering a question like *"what's the shortest chain of related skills connecting Java to React?"* would require self-joining a skills-relationship table repeatedly, with the number of joins growing with every extra hop — and you wouldn't know in advance how many hops you'd need. In a graph database, this is a single `shortestPath()` traversal query, because the relationships are first-class, directly-traversable edges instead of foreign keys re-joined at query time.

This is exactly the kind of question DevGraph's **Skill Connection Explorer** answers: pick any two skills, and the app traverses the graph to find how they're connected, and how many hops apart they are.

---

## Data Model

**Nodes:**

| Label | Properties |
|---|---|
| `Developer` | `id`, `name`, `role` |
| `Skill` | `name` |
| `Project` | `name`, `description` |
| `Technology` | `name` |

**Relationships:**

| Relationship | Direction | Meaning |
|---|---|---|
| `HAS_SKILL` | `Developer → Skill` | A developer possesses a skill |
| `BUILT` | `Developer → Project` | A developer built a project |
| `USES` | `Project → Technology` | A project uses a technology |
| `REQUIRES` | `Project → Skill` | A project requires a skill |
| `RELATED_TO` | `Skill ↔ Skill`, `Technology ↔ Technology` | Two skills or technologies are conceptually connected |

```text
(Developer)-[:HAS_SKILL]->(Skill)-[:RELATED_TO]->(Skill)
     |
     +--[:BUILT]-->(Project)-[:USES]-->(Technology)
                        |
                        +--[:REQUIRES]-->(Skill)
```

Seed data (loaded via `backend/src/main/resources/seed.cypher`) includes 6 developers, 10 skills, 5 technologies, and 5 projects, connected through all five relationship types above — enough to demonstrate multi-hop traversal without needing a large dataset.

---

## Features

- Browse all developers in the graph
- Search developers by name or role
- View a full developer profile: their skills and the projects they've built
- **Skill Connection Explorer** — pick any two skills and find the shortest relationship path between them (multi-hop graph traversal)
- Loading, empty, and error states throughout the UI
- Responsive layout
- REST API backed entirely by CognoDB via parameterized Cypher queries

---

## Tech Stack

**Frontend**
- React 19 (Create React App)
- React Router v7
- Plain CSS, no UI framework

**Backend**
- Java 17
- Spring Boot 4.1 (Spring Web MVC)
- Official Neo4j Java Driver (`neo4j-java-driver`) — CognoDB speaks openCypher over Bolt, so the standard Neo4j driver works without a custom SDK
- `spring-dotenv` for local `.env` file support

**Database**
- CognoDB Cloud (managed graph database, Bolt protocol)

**Hosting**
- Frontend: Vercel
- Backend: Render (Docker-based deploy)

---

## Architecture

```text
React Frontend (Vercel)
      |
      | REST API (fetch)
      v
Spring Boot Backend (Render, Docker)
      |
      | Neo4j Java Driver (Bolt)
      v
CognoDB Cloud
```

The frontend never talks to the database directly — every request goes through the Spring Boot REST layer, which executes parameterized Cypher queries against CognoDB and returns plain JSON.

---

## Cypher Queries

All queries live in `backend/src/main/resources/quries.cypher` and are executed as parameterized queries through the Neo4j Java driver (no string concatenation).

**1. List all developers**
```cypher
MATCH (d:Developer)
RETURN d.id AS id, d.name AS name, d.role AS role
ORDER BY d.name;
```

**2. Get one developer with their skills and projects**
```cypher
MATCH (d:Developer {id: $id})
OPTIONAL MATCH (d)-[:HAS_SKILL]->(s:Skill)
OPTIONAL MATCH (d)-[:BUILT]->(p:Project)
RETURN d,
       collect(DISTINCT s.name) AS skills,
       collect(DISTINCT p.name) AS projects;
```

**3. Shortest path between two skills** *(multi-hop traversal, powers the Skill Connection Explorer)*
```cypher
MATCH path = shortestPath(
  (a:Skill {name: $from})-[:RELATED_TO*..5]->(b:Skill {name: $to})
)
RETURN [node IN nodes(path) | node.name] AS skills;
```
This is the query a relational database would struggle with — it needs a variable-length traversal (up to 5 hops, unknown in advance) to find the shortest chain of related skills, which is a single native operation in Cypher instead of a recursive/repeated self-join.

**4. Developers who know two directly related skills**
```cypher
MATCH (d:Developer)-[:HAS_SKILL]->(s1:Skill)
MATCH (d)-[:HAS_SKILL]->(s2:Skill)
MATCH (s1)-[:RELATED_TO]-(s2)
WHERE s1.name = $skill
RETURN DISTINCT d.name AS developer, s2.name AS relatedSkill
ORDER BY developer;
```

**5. Multi-hop traversal: Developer → Project → Technology**
```cypher
MATCH (d:Developer)-[:BUILT]->(p:Project)-[:USES]->(t:Technology)
RETURN d.name AS developer, p.name AS project, t.name AS technology
ORDER BY developer, project;
```

---

## Project Structure

```
DevGraph/
├── backend/
│   ├── src/main/java/com/devgraph/backend/
│   │   ├── BackendApplication.java
│   │   ├── config/Neo4jConfig.java        # Driver bean, reads COGNODB_* env vars
│   │   ├── controller/GraphController.java # REST endpoints under /api
│   │   ├── service/GraphService.java       # Cypher query execution
│   │   └── exception/GlobalExceptionHandler.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── seed.cypher                    # Seed data load script
│   │   └── quries.cypher                  # All application queries, documented
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── App.js                         # Routes, pages, UI states
│   │   └── api.js                         # REST client, reads REACT_APP_API_URL
│   └── package.json
└── README.md
```

---

## Setup & Run Locally

### 1. Set up CognoDB Cloud

1. Sign up at [console.cognodb.com/signup](https://console.cognodb.com/signup) (free, no credit card required).
2. Create a free (c0) instance and pick a region.
3. Copy the generated `bolt+s://<instance-id>.databases.cognodb.cloud` URI, username (`cognodb`), and password — the password is shown once, so save it immediately.

### 2. Backend

```bash
cd backend
```

Create a `.env` file in `backend/` (this is git-ignored, never commit it):
```env
COGNODB_URI=bolt+s://<your-instance-id>.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=<your-generated-password>
```

Load the seed data using the CognoDB console's query editor (or any Bolt-compatible client) by running the contents of `src/main/resources/seed.cypher` once against your instance.

Run the backend:
```bash
./mvnw spring-boot:run
```
It starts on `http://localhost:8081`. Verify with `http://localhost:8081/api/health`.

### 3. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
REACT_APP_API_URL=http://localhost:8081/api
```

```bash
npm start
```
Opens on `http://localhost:3000`.

---

## Deployment

- **Backend** is deployed on **Render** as a Docker-based web service (Render dropped native Java runtime support, so a `Dockerfile` builds and runs the Spring Boot jar). Environment variables (`COGNODB_URI`, `COGNODB_USERNAME`, `COGNODB_PASSWORD`, `PORT`) are set in Render's dashboard — nothing sensitive is committed to the repo.
- **Frontend** is deployed on **Vercel**, with `REACT_APP_API_URL` set to the live Render backend URL (`https://devgraph-dyb0.onrender.com/api`) as a build-time environment variable.

---

## Error Handling

- The backend uses a global exception handler (`GlobalExceptionHandler`) that catches database/connectivity failures and returns a clean JSON error response instead of leaking stack traces.
- The frontend shows dedicated **loading**, **empty**, and **error** states (with a "Try again" retry action) on every page, so the app degrades gracefully if CognoDB or the backend is temporarily unreachable — rather than showing a blank screen.

---

## Screenshots

*(Add screenshots of the Developers page, a Developer profile, and the Skill Connection Explorer here.)*

---

## Author

**Ananthakrishnan Sudhakaran (Ananthu)**
GitHub: [github.com/ananthakrishnan234](https://github.com/ananthakrishnan234)
