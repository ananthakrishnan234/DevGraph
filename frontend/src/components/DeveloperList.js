import React from "react";

function DeveloperList({
    developers,
    onDeveloperSelect
}) {

    return (
        <div>

            <div className="page-heading">

                <div>
                    <div className="eyebrow">
                        DEVELOPERS
                    </div>

                    <h1>Developer Directory</h1>

                    <p>
                        Explore developers and their connected skills
                        and projects.
                    </p>
                </div>

            </div>

            <div className="developer-grid">

                {developers.map(developer => (

                    <button
                        className="developer-card"
                        key={developer.id}
                        onClick={() =>
                            onDeveloperSelect(developer.id)
                        }
                    >

                        <div className="developer-avatar">
                            {developer.name.charAt(0)}
                        </div>

                        <div className="developer-info">

                            <h2>
                                {developer.name}
                            </h2>

                            <p>
                                {developer.role}
                            </p>

                            <span className="developer-id">
                                {developer.id}
                            </span>

                        </div>

                        <div className="card-arrow">
                            →
                        </div>

                    </button>

                ))}

            </div>

        </div>
    );
}

export default DeveloperList;