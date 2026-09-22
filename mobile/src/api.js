import { API_BASE_URL, DEMO_USER_ID } from "./config";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message || "Request failed");
  }

  return json;
}

export function getCompetition(competitionId) {
  return request(
    `/competitions/${competitionId}?userId=${encodeURIComponent(DEMO_USER_ID)}`
  );
}

export function registerForCompetition(competitionId) {
  return request(`/competitions/${competitionId}/register`, {
    method: "POST",
    body: JSON.stringify({ userId: DEMO_USER_ID })
  });
}

export function cancelRegistration(competitionId) {
  return request(`/competitions/${competitionId}/register`, {
    method: "DELETE",
    body: JSON.stringify({ userId: DEMO_USER_ID })
  });
}
