package com.devgraph.backend.service;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;
import org.neo4j.driver.Record;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GraphService {

    private final Driver driver;

    public GraphService(Driver driver) {
        this.driver = driver;
    }

    public List<Map<String, Object>> getDevelopers() {

        try (Session session = driver.session()) {

            return session.executeRead(tx -> {

                var result = tx.run("""
                    MATCH (d:Developer)
                    RETURN d.id AS id,
                           d.name AS name,
                           d.role AS role
                    ORDER BY d.name
                    """);

                List<Map<String, Object>> developers = new ArrayList<>();

                while (result.hasNext()) {
                    Record record = result.next();

                    developers.add(Map.of(
                            "id", record.get("id").asString(),
                            "name", record.get("name").asString(),
                            "role", record.get("role").asString()
                    ));
                }

                return developers;
            });
        }
    }

    public Map<String, Object> getDeveloper(String id) {

        try (Session session = driver.session()) {

            return session.executeRead(tx -> {

                var result = tx.run("""
                    MATCH (d:Developer {id: $id})
                    OPTIONAL MATCH (d)-[:HAS_SKILL]->(s:Skill)
                    OPTIONAL MATCH (d)-[:BUILT]->(p:Project)
                    RETURN d,
                           collect(DISTINCT s.name) AS skills,
                           collect(DISTINCT p.name) AS projects
                    """,
                        Map.of("id", id)
                );

                if (!result.hasNext()) {
                    return Map.of();
                }

                Record record = result.next();

                return Map.of(
                        "name", record.get("d").get("name").asString(),
                        "role", record.get("d").get("role").asString(),
                        "skills", record.get("skills").asList(),
                        "projects", record.get("projects").asList()
                );
            });
        }
    }
    public List<String> getSkills() {

        try (Session session = driver.session()) {

            return session.executeRead(tx -> {

                var result = tx.run("""
                MATCH (s:Skill)
                RETURN s.name AS name
                ORDER BY s.name
                """);

                List<String> skills = new ArrayList<>();

                while (result.hasNext()) {
                    Record record = result.next();

                    skills.add(
                            record.get("name").asString()
                    );
                }

                return skills;
            });
        }
    }

    public List<Map<String, Object>> findSkillPath(
            String from,
            String to
    ) {

        try (Session session = driver.session()) {

            return session.executeRead(tx -> {

                var result = tx.run("""
                    MATCH path = shortestPath(
                        (a:Skill {name: $from})
                        -[:PREREQUISITE_FOR*..5]->
                        (b:Skill {name: $to})
                    )
                    RETURN [node IN nodes(path) | node.name] AS skills
                    """,
                        Map.of(
                                "from", from,
                                "to", to
                        )
                );

                List<Map<String, Object>> paths = new ArrayList<>();

                while (result.hasNext()) {
                    Record record = result.next();

                    paths.add(Map.of(
                            "skills",
                            record.get("skills").asList()
                    ));
                }

                return paths;
            });
        }
    }
}