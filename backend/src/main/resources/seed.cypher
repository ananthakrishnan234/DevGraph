MATCH (n)
DETACH DELETE n;

CREATE
(d1:Developer {
id: "d1",
name: "Ananya",
role: "Full Stack Developer"
}),

(d2:Developer {
id: "d2",
name: "Rahul",
role: "Backend Developer"
}),

(d3:Developer {
id: "d3",
name: "Meera",
role: "Frontend Developer"
}),

(d4:Developer {
id: "d4",
name: "Arjun",
role: "Cloud Engineer"
}),

(d5:Developer {
id: "d5",
name: "Priya",
role: "Java Developer"
}),

(d6:Developer {
id: "d6",
name: "Vikram",
role: "DevOps Engineer"
}),

(s1:Skill {name: "Java"}),
(s2:Skill {name: "Spring Boot"}),
(s3:Skill {name: "React"}),
(s4:Skill {name: "JavaScript"}),
(s5:Skill {name: "SQL"}),
(s6:Skill {name: "REST APIs"}),
(s7:Skill {name: "Python"}),
(s8:Skill {name: "Docker"}),
(s9:Skill {name: "AWS"}),
(s10:Skill {name: "Git"}),

(t1:Technology {name: "PostgreSQL"}),
(t2:Technology {name: "MongoDB"}),
(t3:Technology {name: "Docker"}),
(t4:Technology {name: "Git"}),
(t5:Technology {name: "AWS"}),

(p1:Project {
name: "CineScope",
description: "Movie discovery and review platform"
}),

(p2:Project {
name: "JobConnect",
description: "Full stack job listing platform"
}),

(p3:Project {
name: "Quiz API",
description: "REST API for technical quizzes"
}),

(p4:Project {
name: "CloudBoard",
description: "Cloud infrastructure monitoring dashboard"
}),

(p5:Project {
name: "DevTracker",
description: "Developer productivity tracking platform"
});


CREATE
(d1)-[:HAS_SKILL]->(s1),
(d1)-[:HAS_SKILL]->(s2),
(d1)-[:HAS_SKILL]->(s3),
(d1)-[:HAS_SKILL]->(s5),
(d1)-[:HAS_SKILL]->(s6),
(d1)-[:HAS_SKILL]->(s10),

(d2)-[:HAS_SKILL]->(s1),
(d2)-[:HAS_SKILL]->(s2),
(d2)-[:HAS_SKILL]->(s6),
(d2)-[:HAS_SKILL]->(s5),
(d2)-[:HAS_SKILL]->(s10),

(d3)-[:HAS_SKILL]->(s3),
(d3)-[:HAS_SKILL]->(s4),
(d3)-[:HAS_SKILL]->(s10),

(d4)-[:HAS_SKILL]->(s8),
(d4)-[:HAS_SKILL]->(s9),
(d4)-[:HAS_SKILL]->(s10),

(d5)-[:HAS_SKILL]->(s1),
(d5)-[:HAS_SKILL]->(s2),
(d5)-[:HAS_SKILL]->(s5),
(d5)-[:HAS_SKILL]->(s10),

(d6)-[:HAS_SKILL]->(s8),
(d6)-[:HAS_SKILL]->(s9),
(d6)-[:HAS_SKILL]->(s10);


CREATE
(d1)-[:BUILT]->(p1),
(d1)-[:BUILT]->(p2),

(d2)-[:BUILT]->(p3),

(d4)-[:BUILT]->(p4),

(d5)-[:BUILT]->(p5);


CREATE
(p1)-[:USES]->(t2),
(p1)-[:REQUIRES]->(s3),

(p2)-[:USES]->(t1),
(p2)-[:USES]->(t3),
(p2)-[:REQUIRES]->(s1),
(p2)-[:REQUIRES]->(s2),

(p3)-[:USES]->(t1),
(p3)-[:REQUIRES]->(s1),
(p3)-[:REQUIRES]->(s6),

(p4)-[:USES]->(t5),
(p4)-[:USES]->(t3),
(p4)-[:REQUIRES]->(s8),
(p4)-[:REQUIRES]->(s9),

(p5)-[:USES]->(t1),
(p5)-[:REQUIRES]->(s1),
(p5)-[:REQUIRES]->(s5);


CREATE
(s1)-[:RELATED_TO]->(s2),
(s2)-[:RELATED_TO]->(s6),
(s6)-[:RELATED_TO]->(s3),
(s3)-[:RELATED_TO]->(s4),

(s1)-[:RELATED_TO]->(s5),
(s5)-[:RELATED_TO]->(s6),

(s8)-[:RELATED_TO]->(s9),
(s8)-[:RELATED_TO]->(s10),

(t1)-[:RELATED_TO]->(t3),
(t2)-[:RELATED_TO]->(t3),
(t3)-[:RELATED_TO]->(t4),
(t3)-[:RELATED_TO]->(t5);