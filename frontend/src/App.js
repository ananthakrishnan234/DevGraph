import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getDeveloper,
  getDevelopers,
  getSkills,
  getSkillPath,
} from "./api";

function LoadingState({ message = "Loading..." }) {
  return (
    <div className="state-card">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="state-card error-state">
      <div className="state-icon">!</div>
      <h3>Something went wrong</h3>
      <p>{message}</p>

      {onRetry && (
        <button className="primary-button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="state-card">
      <div className="state-icon">⌕</div>
      <h3>No results found</h3>
      <p>{message}</p>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="app">
      <header className="navbar">
        <Link to="/" className="brand">
          <div className="brand-mark">D</div>

          <div>
            <div className="brand-name">DevGraph</div>
            <div className="brand-subtitle">Developer Knowledge Graph</div>
          </div>
        </Link>

        <nav className="nav-links">
          <Link to="/">Developers</Link>
          <Link to="/graph">Graph Explorer</Link>
        </nav>
      </header>

      <main className="main-content">{children}</main>

      <footer className="footer">
        <p>
          DevGraph · A graph-powered developer knowledge explorer
        </p>
      </footer>
    </div>
  );
}

function DeveloperCard({ developer }) {
  return (
    <Link
      to={`/developers/${developer.id}`}
      className="developer-card"
    >
      <div className="developer-avatar">
        {developer.name.charAt(0)}
      </div>

      <div className="developer-card-content">
        <div className="developer-card-top">
          <h3>{developer.name}</h3>
          <span className="arrow">→</span>
        </div>

        <p className="role">{developer.role}</p>

        <div className="developer-meta">
          <span>Developer ID</span>
          <strong>{developer.id}</strong>
        </div>

        <div className="view-profile">
          View developer profile
        </div>
      </div>
    </Link>
  );
}

function DevelopersPage() {
  const [developers, setDevelopers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDevelopers() {
    try {
      setLoading(true);
      setError("");

      const data = await getDevelopers();
      setDevelopers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDevelopers();
  }, []);

  const filteredDevelopers = developers.filter((developer) => {
    const value = search.toLowerCase();

    return (
      developer.name.toLowerCase().includes(value) ||
      developer.role.toLowerCase().includes(value)
    );
  });

  return (
    <section>
      <div className="hero">
        <div>
          <span className="eyebrow">KNOWLEDGE GRAPH</span>

          <h1>Explore the developer network</h1>

          <p>
            Discover relationships between developers, skills,
            projects and technologies through a graph database.
          </p>
        </div>

        <Link to="/graph" className="primary-button hero-button">
          Explore Graph →
        </Link>
      </div>

      <div className="search-container">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search developers or roles..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && <LoadingState message="Loading developers..." />}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={loadDevelopers}
        />
      )}

      {!loading &&
        !error &&
        filteredDevelopers.length === 0 && (
          <EmptyState
            message={
              search
                ? "Try a different developer name or role."
                : "No developers are available in the graph."
            }
          />
        )}

      {!loading && !error && filteredDevelopers.length > 0 && (
        <>
          <div className="section-heading">
            <div>
              <h2>Developers</h2>
              <p>
                {filteredDevelopers.length} developer
                {filteredDevelopers.length !== 1 ? "s" : ""} in the graph
              </p>
            </div>
          </div>

          <div className="developer-grid">
            {filteredDevelopers.map((developer) => (
              <DeveloperCard
                key={developer.id}
                developer={developer}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function DeveloperPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDeveloper() {
    try {
      setLoading(true);
      setError("");

      const data = await getDeveloper(id);

      if (!data || Object.keys(data).length === 0) {
        throw new Error("Developer not found.");
      }

      setDeveloper(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDeveloper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <LoadingState message="Loading developer profile..." />;
  }

  if (error) {
    return (
      <>
        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Back to developers
        </button>

        <ErrorState
          message={error}
          onRetry={loadDeveloper}
        />
      </>
    );
  }

  return (
    <section>
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back to developers
      </button>

      <div className="profile-header">
        <div className="large-avatar">
          {developer.name.charAt(0)}
        </div>

        <div>
          <span className="eyebrow">DEVELOPER PROFILE</span>

          <h1>{developer.name}</h1>

          <p className="profile-role">{developer.role}</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="info-panel">
          <div className="panel-heading">
            <span>01</span>
            <h2>Skills</h2>
          </div>

          {developer.skills?.length > 0 ? (
            <div className="tag-list">
              {developer.skills.map((skill) => (
                <Link
                  key={skill}
                  to={`/graph?from=${encodeURIComponent(skill)}`}
                  className="skill-tag"
                >
                  {skill}
                </Link>
              ))}
            </div>
          ) : (
            <p className="muted">No skills recorded.</p>
          )}
        </div>

        <div className="info-panel">
          <div className="panel-heading">
            <span>02</span>
            <h2>Projects</h2>
          </div>

          {developer.projects?.length > 0 ? (
            <div className="project-list">
              {developer.projects.map((project) => (
                <div className="project-item" key={project}>
                  <div className="project-icon">◆</div>

                  <div>
                    <h3>{project}</h3>
                    <p>Built by {developer.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted">No projects recorded.</p>
          )}
        </div>
      </div>

      <div className="connection-callout">
        <div>
          <span className="eyebrow">GRAPH EXPLORATION</span>

          <h2>Explore how these skills connect</h2>

          <p>
            Use graph traversal to find relationships between
            technologies and skills.
          </p>
        </div>

        <Link to="/graph" className="primary-button">
          Open Graph Explorer →
        </Link>
      </div>
    </section>
  );
}

function GraphExplorerPage() {
  const [skills, setSkills] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [path, setPath] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingPath, setLoadingPath] = useState(false);

  const [error, setError] = useState("");
  const [pathError, setPathError] = useState("");

  useEffect(() => {
    async function loadSkills() {
      try {
        setLoadingSkills(true);
        setError("");

        const data = await getSkills();

        setSkills(data);

        if (data.length >= 2) {
          setFrom(data[0]);
          setTo(data[1]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingSkills(false);
      }
    }

    loadSkills();
  }, []);

  async function findPath(event) {
    event.preventDefault();

    if (!from || !to) {
      setPathError("Please select both skills.");
      return;
    }

    if (from === to) {
      setPathError("Choose two different skills.");
      return;
    }

    try {
      setLoadingPath(true);
      setPathError("");
      setPath([]);

      const result = await getSkillPath(from, to);

      if (!result || result.length === 0) {
        setPathError(
          `No relationship path was found between ${from} and ${to}.`
        );
        return;
      }

      setPath(result[0].skills || []);
    } catch (err) {
      setPathError(err.message);
    } finally {
      setLoadingPath(false);
    }
  }

  return (
    <section>
      <div className="graph-hero">
        <span className="eyebrow">GRAPH TRAVERSAL</span>

        <h1>Skill Connection Explorer</h1>

        <p>
          Find the shortest relationship path between two skills
          using a Cypher graph traversal.
        </p>
      </div>

      <div className="graph-panel">
        <form onSubmit={findPath}>
          <div className="select-grid">
            <div className="field">
              <label>From skill</label>

              <select
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                disabled={loadingSkills}
              >
                <option value="">Select a skill</option>

                {skills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>

            <div className="path-arrow">→</div>

            <div className="field">
              <label>To skill</label>

              <select
                value={to}
                onChange={(event) => setTo(event.target.value)}
                disabled={loadingSkills}
              >
                <option value="">Select a skill</option>

                {skills.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="inline-error">
              {error}
            </div>
          )}

          {pathError && (
            <div className="inline-error">
              {pathError}
            </div>
          )}

          <button
            type="submit"
            className="primary-button find-button"
            disabled={loadingSkills || loadingPath}
          >
            {loadingPath ? "Finding path..." : "Find Connection"}
          </button>
        </form>
      </div>

      {loadingSkills && (
        <LoadingState message="Loading skills from CognoDB..." />
      )}

      {!loadingPath && path.length > 0 && (
        <div className="path-result">
          <div className="result-heading">
            <div>
              <span className="eyebrow">FOUND PATH</span>

              <h2>
                {from} → {to}
              </h2>
            </div>

            <span className="hop-count">
              {path.length - 1} hop
              {path.length - 1 !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="path-visual">
            {path.map((skill, index) => (
              <React.Fragment key={`${skill}-${index}`}>
                <div className="path-node">
                  <span>{index + 1}</span>
                  <strong>{skill}</strong>
                </div>

                {index < path.length - 1 && (
                  <div className="path-connector">
                    ↓
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {!loadingPath &&
        !pathError &&
        !loadingSkills &&
        path.length === 0 && (
          <div className="graph-explanation">
            <div className="explanation-icon">◇</div>

            <h2>Why graph traversal?</h2>

            <p>
              DevGraph doesn't simply store developers in rows.
              Skills, projects and technologies are connected
              through typed relationships. This lets us traverse
              the network and discover connections between entities.
            </p>
          </div>
        )}
    </section>
  );
}

function NotFoundPage() {
  return (
    <div className="state-card">
      <div className="state-icon">?</div>

      <h2>Page not found</h2>

      <p>The page you're looking for doesn't exist.</p>

      <Link to="/" className="primary-button">
        Go home
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DevelopersPage />} />

          <Route
            path="/developers/:id"
            element={<DeveloperPage />}
          />

          <Route
            path="/graph"
            element={<GraphExplorerPage />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;