import React from "react";

function DeveloperDetails({
    developer,
    onBack
}) {

    return (
        <div>

            <button
                className="back-button"
                onClick={onBack}
            >
                ← Back to Developers
            </button>

            <div className="profile-header">

                <div className="large-avatar">
                    {developer.name.charAt(0)}
                </div>

                <div>

                    <div className="eyebrow">
                        DEVELOPER PROFILE
                    </div>

                    <h1>{developer.name}</h1>

                    <p>{developer.role}</p>

                </div>

            </div>

            <div className="details-grid">

                <div className="panel">

                    <div className="panel-header">
                        <div>
                            <h2>Skills</h2>
                            <p>
                                Skills connected to this developer
                            </p>
                        </div>
                    </div>

                    <div className="tag-container">

                        {developer.skills.map(skill => (

                            <span
                                className="tag"
                                key={skill}
                            >
                                {skill}
                            </span>

                        ))}

                    </div>

                </div>

                <div className="panel">

                    <div className="panel-header">
                        <div>
                            <h2>Projects</h2>
                            <p>
                                Projects built by this developer
                            </p>
                        </div>
                    </div>

                    <div className="profile-projects">

                        {developer.projects.map(project => (

                            <div
                                className="profile-project"
                                key={project}
                            >
                                <span>◈</span>
                                {project}
                            </div>

                        ))}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default DeveloperDetails;