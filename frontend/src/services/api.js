// services/api.js
// All API calls go through this module. No API logic lives in components.

const BASE_URL = '/api';

/**
 * Fetch all users from the database.
 * @returns {Promise<Array>} Array of user objects
 */
export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch users');
  return json.data;
}

/**
 * Create a new user.
 * @param {{ name: string, email: string }} userData
 * @returns {Promise<Object>} The created user object
 */
export async function createUser(userData) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to create user');
  return json.data;
}

/**
 * Update an existing user.
 * @param {number|string} id
 * @param {{ name: string, email: string }} userData
 * @returns {Promise<Object>} The updated user object
 */
export async function updateUser(id, userData) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to update user');
  return json.data;
}

/**
 * Delete a user by ID.
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function deleteUser(id) {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to delete user');
}

/**
 * Check if the backend is reachable.
 * @returns {Promise<boolean>}
 */
export async function checkHealth() {
  try {
    const res = await fetch('/health', { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
