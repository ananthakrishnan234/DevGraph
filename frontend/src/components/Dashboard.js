import React from "react";

function Dashboard({ developers }) {

    const skills = [
        "Java",
        "Spring Boot",
        "React",
        "JavaScript",
        "SQL",
        "REST APIs"
    ];

    const technologies = [
        "PostgreSQL",
        "MongoDB",
        "Docker",
        "Git"
    ];

    const projects = [
        "CineScope",
        "JobConnect",
        "Quiz API"
    ];

    return (
        <div>

            <div className="hero">

                <div>
                    <div className="eyebrow">
                        DEVELOPER KNOWLEDGE GRAPH
                    </div>

                    <h1>
                        Explore the developer ecosystem.
                    </h1>

                    <p>
                        Discover developers, skills, projects and
                        technologies through interconnected graph data.
                    </p>
                </div>

            </div>

            <div className="stats">

                <div className="stat-card">
                    <span>Developers</span>
                    <strong>{developers.length}</strong>
                </div>

                <div className="stat-card">
                    <span>Skills</span>
                    <strong>{skills.length}</strong>
                </div>

                <div className="stat-card">
                    <span>Projects</span>
                    <strong>{projects.length}</strong>
                </div>

                <div className="stat-card">
                    <span>Technologies</span>
                    <strong>{technologies.length}</strong>
                </div>

            </div>

            <div className="dashboard-grid">

                <div className="panel">

                    <div className="panel-header">
                        <div>
                            <h2>Skills</h2>
                            <p>Core development skills in the graph</p>
                        </div>
                    </div>

                    <div className="tag-container">

                        {skills.map(skill => (
                            <span className="tag" key={skill}>
                                {skill}
                            </span>
                        ))}

                    </div>

                </div>

                <div className="panel">

                    <div className="panel-header">
                        <div>
                            <h2>Technologies</h2>
                            <p>Tools and platforms used by projects</p>
                        </div>
                    </div>

                    <div className="tag-container">

                        {technologies.map(technology => (
                            <span
                                className="tag technology"
                                key={technology}
                            >
                                {technology}
                            </span>
                        ))}

                    </div>

                </div>

            </div>

            <div className="panel">

                <div className="panel-header">
                    <div>
                        <h2>Projects</h2>
                        <p>Projects connected to developers and technologies</p>
                    </div>
                </div>

                <div className="project-grid">

                    {projects.map(project => (
                        <div className="project-card" key={project}>
                            <div className="project-icon">
                                ◈
                            </div>

                            <div>
                                <h3>{project}</h3>
                                <p>
                                    Connected project in the developer graph
                                </p>
                            </div>
                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}

export default Dashboard;