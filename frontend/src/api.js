const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8081/api";

async function request(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function getDevelopers() {
  return request("/developers");
}

export async function getDeveloper(id) {
  return request(`/developers/${encodeURIComponent(id)}`);
}

export async function getSkills() {
  return request("/skills");
}

export async function getSkillPath(from, to) {
  return request(
    `/skills/path?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`
  );
}