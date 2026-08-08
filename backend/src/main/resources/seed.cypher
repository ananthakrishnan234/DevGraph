MATCH (n)
DETACH DELETE n;

CREATE
(d1:Developer {id: "d1", name: "Ananya", role: "Full Stack Developer"}),
(d2:Developer {id: "d2", name: "Rahul", role: "Backend Developer"}),
(d3:Developer {id: "d3", name: "Meera", role: "Frontend Developer"}),
(d4:Developer {id: "d4", name: "Arjun", role: "Cloud Engineer"}),
(d5:Developer {id: "d5", name: "Priya", role: "Java Developer"}),
(d6:Developer {id: "d6", name: "Vikram", role: "DevOps Engineer"}),
(d7:Developer {id: "d7", name: "Sneha", role: "Data Engineer"}),
(d8:Developer {id: "d8", name: "Karthik", role: "Mobile Developer"}),
(d9:Developer {id: "d9", name: "Divya", role: "QA Engineer"}),
(d10:Developer {id: "d10", name: "Rohan", role: "Machine Learning Engineer"}),
(d11:Developer {id: "d11", name: "Anjali", role: "Site Reliability Engineer"}),
(d12:Developer {id: "d12", name: "Nikhil", role: "Solutions Architect"}),

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
(s11:Skill {name: "TypeScript"}),
(s12:Skill {name: "Node.js"}),
(s13:Skill {name: "Kubernetes"}),
(s14:Skill {name: "GraphQL"}),
(s15:Skill {name: "Machine Learning"}),
(s16:Skill {name: "CI/CD"}),

(t1:Technology {name: "PostgreSQL"}),
(t2:Technology {name: "MongoDB"}),
(t3:Technology {name: "Docker"}),
(t4:Technology {name: "Git"}),
(t5:Technology {name: "AWS"}),
(t6:Technology {name: "Kubernetes"}),
(t7:Technology {name: "Redis"}),
(t8:Technology {name: "TensorFlow"}),

(p1:Project {name: "CineScope", description: "Movie discovery and review platform"}),
(p2:Project {name: "JobConnect", description: "Full stack job listing platform"}),
(p3:Project {name: "Quiz API", description: "REST API for technical quizzes"}),
(p4:Project {name: "CloudBoard", description: "Cloud infrastructure monitoring dashboard"}),
(p5:Project {name: "DevTracker", description: "Developer productivity tracking platform"}),
(p6:Project {name: "DataPipe", description: "ETL pipeline for analytics warehousing"}),
(p7:Project {name: "FitTrack Mobile", description: "Cross-platform fitness tracking app"}),
(p8:Project {name: "TestSuite", description: "Automated end-to-end testing framework"}),
(p9:Project {name: "ChurnPredict", description: "ML model predicting customer churn"}),
(p10:Project {name: "DeployHub", description: "Internal CI/CD deployment platform"});


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
(d3)-[:HAS_SKILL]->(s11),
(d3)-[:HAS_SKILL]->(s10),

(d4)-[:HAS_SKILL]->(s8),
(d4)-[:HAS_SKILL]->(s9),
(d4)-[:HAS_SKILL]->(s13),
(d4)-[:HAS_SKILL]->(s10),

(d5)-[:HAS_SKILL]->(s1),
(d5)-[:HAS_SKILL]->(s2),
(d5)-[:HAS_SKILL]->(s5),
(d5)-[:HAS_SKILL]->(s10),

(d6)-[:HAS_SKILL]->(s8),
(d6)-[:HAS_SKILL]->(s9),
(d6)-[:HAS_SKILL]->(s16),
(d6)-[:HAS_SKILL]->(s10),

(d7)-[:HAS_SKILL]->(s7),
(d7)-[:HAS_SKILL]->(s5),
(d7)-[:HAS_SKILL]->(s9),
(d7)-[:HAS_SKILL]->(s10),

(d8)-[:HAS_SKILL]->(s4),
(d8)-[:HAS_SKILL]->(s11),
(d8)-[:HAS_SKILL]->(s12),
(d8)-[:HAS_SKILL]->(s10),

(d9)-[:HAS_SKILL]->(s6),
(d9)-[:HAS_SKILL]->(s16),
(d9)-[:HAS_SKILL]->(s10),

(d10)-[:HAS_SKILL]->(s7),
(d10)-[:HAS_SKILL]->(s15),
(d10)-[:HAS_SKILL]->(s5),
(d10)-[:HAS_SKILL]->(s10),

(d11)-[:HAS_SKILL]->(s8),
(d11)-[:HAS_SKILL]->(s13),
(d11)-[:HAS_SKILL]->(s9),
(d11)-[:HAS_SKILL]->(s16),
(d11)-[:HAS_SKILL]->(s10),

(d12)-[:HAS_SKILL]->(s1),
(d12)-[:HAS_SKILL]->(s9),
(d12)-[:HAS_SKILL]->(s6),
(d12)-[:HAS_SKILL]->(s14),
(d12)-[:HAS_SKILL]->(s10);


CREATE
(d1)-[:BUILT]->(p1),
(d1)-[:BUILT]->(p2),

(d2)-[:BUILT]->(p3),

(d4)-[:BUILT]->(p4),

(d5)-[:BUILT]->(p5),

(d7)-[:BUILT]->(p6),

(d8)-[:BUILT]->(p7),

(d9)-[:BUILT]->(p8),

(d10)-[:BUILT]->(p9),

(d11)-[:BUILT]->(p10);


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
(p5)-[:REQUIRES]->(s5),

(p6)-[:USES]->(t2),
(p6)-[:USES]->(t5),
(p6)-[:REQUIRES]->(s7),
(p6)-[:REQUIRES]->(s5),

(p7)-[:USES]->(t2),
(p7)-[:REQUIRES]->(s11),
(p7)-[:REQUIRES]->(s12),

(p8)-[:USES]->(t3),
(p8)-[:REQUIRES]->(s6),
(p8)-[:REQUIRES]->(s16),

(p9)-[:USES]->(t8),
(p9)-[:REQUIRES]->(s7),
(p9)-[:REQUIRES]->(s15),

(p10)-[:USES]->(t6),
(p10)-[:USES]->(t3),
(p10)-[:REQUIRES]->(s16),
(p10)-[:REQUIRES]->(s9);


CREATE
(s1)-[:RELATED_TO]->(s2),
(s2)-[:RELATED_TO]->(s6),
(s6)-[:RELATED_TO]->(s3),
(s3)-[:RELATED_TO]->(s4),
(s4)-[:RELATED_TO]->(s11),
(s11)-[:RELATED_TO]->(s12),
(s12)-[:RELATED_TO]->(s14),

(s1)-[:RELATED_TO]->(s5),
(s5)-[:RELATED_TO]->(s6),

(s8)-[:RELATED_TO]->(s9),
(s8)-[:RELATED_TO]->(s10),
(s9)-[:RELATED_TO]->(s13),
(s13)-[:RELATED_TO]->(s16),
(s16)-[:RELATED_TO]->(s10),

(s7)-[:RELATED_TO]->(s5),
(s7)-[:RELATED_TO]->(s15),
(s15)-[:RELATED_TO]->(s5),

(s6)-[:RELATED_TO]->(s14),

(t1)-[:RELATED_TO]->(t3),
(t2)-[:RELATED_TO]->(t3),
(t3)-[:RELATED_TO]->(t4),
(t3)-[:RELATED_TO]->(t5),
(t5)-[:RELATED_TO]->(t6),
(t2)-[:RELATED_TO]->(t7),
(t8)-[:RELATED_TO]->(t2);
