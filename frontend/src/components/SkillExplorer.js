import React, { useState } from "react";
import { getSkillPath } from "../api";

function SkillExplorer() {

    const skills = [
        "Java",
        "Spring Boot",
        "React",
        "JavaScript",
        "SQL",
        "REST APIs"
    ];

    const [from, setFrom] = useState("Java");
    const [to, setTo] = useState("React");

    const [path, setPath] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const findPath = async () => {

        if (from === to) {
            setError("Please select two different skills.");
            setPath([]);
            return;
        }

        try {

            setLoading(true);
            setError("");
            setPath([]);

            const result = await getSkillPath(from, to);

            if (!result.length) {
                setError(
                    `No relationship path found between ${from} and ${to}.`
                );
                return;
            }

            setPath(result[0].skills);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to find a relationship path."
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div>

            <div className="page-heading">

                <div>

                    <div className="eyebrow">
                        GRAPH EXPLORER
                    </div>

                    <h1>Skill Path Explorer</h1>

                    <p>
                        Discover how skills are connected through
                        the knowledge graph.
                    </p>

                </div>

            </div>

            <div className="explorer">

                <div className="selector">

                    <label>
                        Starting Skill
                    </label>

                    <select
                        value={from}
                        onChange={(e) =>
                            setFrom(e.target.value)
                        }
                    >

                        {skills.map(skill => (
                            <option
                                value={skill}
                                key={skill}
                            >
                                {skill}
                            </option>
                        ))}

                    </select>

                </div>

                <div className="path-arrow">
                    →
                </div>

                <div className="selector">

                    <label>
                        Destination Skill
                    </label>

                    <select
                        value={to}
                        onChange={(e) =>
                            setTo(e.target.value)
                        }
                    >

                        {skills.map(skill => (
                            <option
                                value={skill}
                                key={skill}
                            >
                                {skill}
                            </option>
                        ))}

                    </select>

                </div>

                <button
                    className="primary-button"
                    onClick={findPath}
                    disabled={loading}
                >
                    {loading
                        ? "Finding..."
                        : "Find Path"
                    }
                </button>

            </div>

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            {path.length > 0 && (

                <div className="path-result">

                    <div className="path-result-header">

                        <div>
                            <div className="eyebrow">
                                GRAPH RESULT
                            </div>

                            <h2>
                                Shortest Skill Path
                            </h2>
                        </div>

                    </div>

                    <div className="graph-path">

                        {path.map((skill, index) => (

                            <React.Fragment key={skill}>

                                <div className="graph-node">

                                    <div className="node-circle">
                                        {index + 1}
                                    </div>

                                    <span>
                                        {skill}
                                    </span>

                                </div>

                                {index < path.length - 1 && (
                                    <div className="graph-line">
                                        →
                                    </div>
                                )}

                            </React.Fragment>

                        ))}

                    </div>

                </div>

            )}

        </div>
    );
}

export default SkillExplorer;