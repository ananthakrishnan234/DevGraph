<div align="center">

# 🕸️ DevGraph — Developer Knowledge Graph

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/spring_boot-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![CognoDB](https://img.shields.io/badge/CognoDB-graph_db-4B32C3?style=for-the-badge&logo=neo4j&logoColor=white)
![Cypher](https://img.shields.io/badge/openCypher-Bolt_Protocol-008CC1?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=for-the-badge)

**A graph-powered application that explores how developers, skills, projects, and technologies connect — built on CognoDB using parameterized openCypher traversals.**

[🌐 Live Demo](https://dev-graph-sable.vercel.app/) · [🐛 Report Bug](https://github.com/ananthakrishnan234/DevGraph/issues)

</div>

---

## 📌 About

DevGraph is a full-stack developer knowledge explorer built as a graph-database application on **CognoDB**. Instead of storing developers, skills, and projects as rows across join tables, DevGraph models them as a connected graph — so questions like *"how is Java related to React?"* become a single traversal query instead of a chain of joins.

Built for a take-home assignment requiring a real, working application backed by a graph database, with a clean UI a non-technical person could use, parameterized Cypher queries, and a genuine "why graph, not relational" case.

### Engineering highlights
- **Graph data model** — labeled nodes (`Developer`, `Skill`, `Project`, `Technology`) connected by typed relationships (`HAS_SKILL`, `BUILT`, `USES`, `REQUIRES`, `RELATED_TO`)
- **Multi-hop traversal** — a `shortestPath()` query finds the shortest chain of related skills between any two skills, up to 5 hops deep
- **Parameterized Cypher** via the official Neo4j Java driver — no string-concatenated queries anywhere
- **Service layer separation** — controllers never write raw Cypher; all queries live in `GraphService`
- **Global exception handling** — the app degrades gracefully with a clean error response if CognoDB is unreachable
- **Env-var-only secrets** — CognoDB URI, username, and password are never committed to the repo

---

## 🧠 Why a Graph Database?

A developer knowledge network is naturally a graph, not a table.

A developer has many skills, builds multiple projects, and those projects use technologies that themselves require additional skills. Skills also relate to each other — Java naturally connects to Spring Boot, which connects to REST APIs, which connects to React.

```
Developer -[:HAS_SKILL]-> Skill
Developer -[:BUILT]-> Project -[:USES]-> Technology
Project -[:REQUIRES]-> Skill
Skill -[:RELATED_TO]-> Skill
```

In a **relational database**, answering *"what's the shortest chain of related skills connecting Java to React?"* means self-joining a skills-relationship table repeatedly — and you don't know in advance how many joins you'll need, since the path length varies. In a **graph database**, this is one native `shortestPath()` traversal, because relationships are directly-walkable edges instead of foreign keys re-joined at query time.

This is exactly what DevGraph's **Skill Connection Explorer** does: pick any two skills, and the app traverses CognoDB to find the shortest relationship path between them — a query a relational schema would genuinely struggle with.

---

## 🗺️ Data Model

**Nodes**

| Label | Properties |
|---|---|
| `Developer` | `id`, `name`, `role` |
| `Skill` | `name` |
| `Project` | `name`, `description` |
| `Technology` | `name` |

**Relationships**

| Relationship | Direction | Meaning |
|---|---|---|
| `HAS_SKILL` | `Developer → Skill` | A developer possesses a skill |
| `BUILT` | `Developer → Project` | A developer built a project |
| `USES` | `Project → Technology` | A project uses a technology |
| `REQUIRES` | `Project → Skill` | A project requires a skill |
| `RELATED_TO` | `Skill ↔ Skill`, `Technology ↔ Technology` | Two skills/technologies are conceptually connected |

**Diagram**

```text
(Developer)-[:HAS_SKILL]->(Skill)-[:RELATED_TO]->(Skill)
     |
     +--[:BUILT]-->(Project)-[:USES]-->(Technology)
                        |
                        +--[:REQUIRES]-->(Skill)
```

Seed data (`backend/src/main/resources/seed.cypher`) loads 6 developers, 10 skills, 5 technologies, and 5 projects — fully connected across all five relationship types, enough to demonstrate real multi-hop traversal without needing a large dataset.

---

## ✨ Features

| Category | Details |
|---|---|
| 👥 **Developer Directory** | Browse all developers, search by name or role |
| 🧑‍💻 **Developer Profiles** | View a developer's skills and the projects they built |
| 🔗 **Skill Connection Explorer** | Pick two skills, find the shortest relationship path between them (multi-hop traversal) |
| ⏳ **Loading States** | Spinner-based loading feedback on every data fetch |
| 🗂️ **Empty States** | Clear messaging when no results are found |
| ⚠️ **Error States** | Friendly error cards with a "Try again" retry action |
| 📱 **Responsive UI** | Clean, readable layout across screen sizes |

---

## 🛠️ Tech Stack

**Backend:** Java 17 · Spring Boot 4.1 · Spring Web MVC · Official Neo4j Java Driver (Bolt protocol) · Maven
**Frontend:** React 19 · React Router v7 · Plain CSS
**Database:** CognoDB Cloud (managed graph database, openCypher over Bolt)
**Deployment:** Vercel (frontend) · Render, Docker-based (backend)

---

## 📁 Project Structure

```
DevGraph/
│
├── backend/
│   ├── src/main/java/com/devgraph/backend/
│   │   ├── BackendApplication.java
│   │   ├── config/Neo4jConfig.java         # Driver bean, reads COGNODB_* env vars
│   │   ├── controller/GraphController.java # REST endpoints under /api
│   │   ├── service/GraphService.java       # All Cypher query execution
│   │   └── exception/GlobalExceptionHandler.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   ├── seed.cypher                     # Seed data load script
│   │   └── quries.cypher                   # All queries, documented
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── App.js                          # Routes, pages, UI states
│   │   └── api.js                          # REST client, reads REACT_APP_API_URL
│   └── package.json
│
└── README.md
```

---

## 🔍 Cypher Queries

All queries live in `backend/src/main/resources/quries.cypher`, executed as **parameterized queries** through the Neo4j Java driver — no string concatenation anywhere.

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

**3. Shortest path between two skills** — *multi-hop traversal powering the Skill Connection Explorer*
```cypher
MATCH path = shortestPath(
  (a:Skill {name: $from})-[:RELATED_TO*..5]->(b:Skill {name: $to})
)
RETURN [node IN nodes(path) | node.name] AS skills;
```
This is the query a relational schema would find awkward — a variable-length traversal (up to 5 hops, unknown ahead of time) to find the shortest chain of related skills, done as one native graph operation instead of repeated self-joins.

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

## 🚀 Getting Started

### 1. Set up CognoDB Cloud

1. Sign up at [console.cognodb.com/signup](https://console.cognodb.com/signup) — free tier, no credit card required.
2. Create a free (c0) instance and pick a region — provisions in under a minute.
3. Copy the generated `bolt+s://<instance-id>.databases.cognodb.cloud` URI, username (`cognodb`), and password. **The password is shown only once** — save it immediately.

### 2. Clone the repository

```bash
git clone https://github.com/ananthakrishnan234/DevGraph.git
cd DevGraph
```

### 3. Backend setup (Spring Boot + CognoDB)

Set the following as **environment variables** — never hardcode these or commit them:

```env
COGNODB_URI=bolt+s://<your-instance-id>.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=<your-generated-password>
```

Load the seed data by running `backend/src/main/resources/seed.cypher` once against your CognoDB instance (via the CognoDB console's query editor or any Bolt-compatible client).

Run the backend:
```bash
cd backend
./mvnw spring-boot:run
```
Backend runs at `http://localhost:8081` — verify with `http://localhost:8081/api/health`.

### 4. Frontend setup (React)

Create a `.env` file in `frontend/`:
```env
REACT_APP_API_URL=http://localhost:8081/api
```

```bash
cd frontend
npm install
npm start
```
Frontend runs at `http://localhost:3000`.

---

## 🌐 Deployment Notes

- **Backend** is deployed on **Render** as a Docker-based web service (Render doesn't offer a native Java runtime, so a `Dockerfile` builds and runs the Spring Boot jar). `COGNODB_URI`, `COGNODB_USERNAME`, and `COGNODB_PASSWORD` are set as Render environment variables — nothing sensitive lives in the repo.
- **Frontend** is deployed on **Vercel**, with `REACT_APP_API_URL` set to the live Render backend (`https://devgraph-dyb0.onrender.com/api`) as a build-time environment variable.
- CORS on the backend is open (`@CrossOrigin(origins = "*")`) to allow the Vercel frontend to reach it.

---

## ⚠️ Error Handling

- The backend's `GlobalExceptionHandler` catches database/connectivity failures and returns a clean, structured JSON error instead of leaking stack traces to the client.
- The frontend renders dedicated **loading**, **empty**, and **error** states (with a "Try again" retry action) on every page, so the UI degrades gracefully if CognoDB or the backend is temporarily unreachable instead of showing a blank screen.

---

## 📸 Screenshots

*(Add screenshots of the Developers page, a Developer profile, and the Skill Connection Explorer here.)*

---

## 🎥 Demo Recording

*(Add a link to a short screen recording walking through the app here.)*

---

## 🗺️ Roadmap

- [ ] Filter developers by skill directly from the Graph Explorer
- [ ] Visual force-directed graph rendering (not just path lists)
- [ ] Add `Company` and `WORKS_AT` nodes/relationships
- [ ] Swagger/OpenAPI documentation for the REST layer

---

## 📄 License

Licensed under the MIT License — see [LICENSE](./LICENSE) for details.

---

## 📬 Contact

**Ananthakrishnan Sudhakaran**
📧 [ananthakrishnans234@gmail.com](mailto:ananthakrishnans234@gmail.com) · 💼 [LinkedIn](https://www.linkedin.com/in/ananthakrishnan234/) · 🐙 [GitHub](https://github.com/ananthakrishnan234)

<div align="center">

⭐ If this project helped you, consider giving it a star!

</div>
