# DevGraph

## Developer Knowledge Graph powered by CognoDB

DevGraph is a graph database application that helps users explore relationships between developers, skills, projects and technologies.

The application uses CognoDB as its graph database and the official Neo4j Java driver to execute parameterized openCypher queries.

---

## Features

- Browse developers
- Search developers by name or role
- View developer profiles
- Explore developer skills and projects
- Discover shortest paths between skills
- Multi-hop graph traversal
- Graph-powered relationship exploration
- Loading, empty and error states
- Responsive UI
- REST API backed by CognoDB

---

# Why a Graph Database?

A developer knowledge network is naturally represented as a graph.

A developer can have many skills, build multiple projects, and those projects can use technologies and require additional skills.

For example:

Developer → BUILT → Project → USES → Technology

and:

Developer → HAS_SKILL → Skill → RELATED_TO → Skill

In a relational database, these relationships would require multiple join tables and increasingly complex joins when traversing several levels.

A graph database allows the application to directly traverse these relationships.

The Skill Connection Explorer demonstrates this by finding paths such as:

Java → Spring Boot → REST APIs → React

This type of multi-hop relationship traversal is a natural graph operation.

---

# Architecture

```text
React Frontend
      |
      | REST API
      v
Spring Boot Backend
      |
      | Neo4j Java Driver
      v
CognoDB
