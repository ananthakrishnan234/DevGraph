// ============================================================
// 1. List all developers
// ============================================================

MATCH (d:Developer)
RETURN d.id AS id,
d.name AS name,
d.role AS role
ORDER BY d.name;


// ============================================================
// 2. Get one developer with skills and projects
// ============================================================

MATCH (d:Developer {id: $id})
OPTIONAL MATCH (d)-[:HAS_SKILL]->(s:Skill)
OPTIONAL MATCH (d)-[:BUILT]->(p:Project)
RETURN d,
collect(DISTINCT s.name) AS skills,
collect(DISTINCT p.name) AS projects;


// ============================================================
// 3. Find shortest skill path
//
// Example:
// from = "Java"
// to = "React"
// ============================================================

MATCH path = shortestPath(
(a:Skill {name: $from})
-[:RELATED_TO*..5]->
(b:Skill {name: $to})
)
RETURN [
node IN nodes(path) | node.name
] AS skills;


// ============================================================
// 4. Find developers who know two connected skills
// ============================================================

MATCH (d:Developer)-[:HAS_SKILL]->(s1:Skill)
MATCH (d)-[:HAS_SKILL]->(s2:Skill)
MATCH (s1)-[:RELATED_TO]-(s2)
WHERE s1.name = $skill
RETURN DISTINCT
d.name AS developer,
s2.name AS relatedSkill
ORDER BY developer;


// ============================================================
// 5. Multi-hop project technology traversal
// Developer → Project → Technology
// ============================================================

MATCH (d:Developer)-[:BUILT]->(p:Project)-[:USES]->(t:Technology)
RETURN d.name AS developer,
p.name AS project,
t.name AS technology
ORDER BY developer, project;