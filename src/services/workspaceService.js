import { apiClient } from './apiClient';

export async function getWorkspaces() {
  return apiClient('/api/v1/workspaces');
}

export async function createWorkspace(name, description = '', mode = 'research') {
  return apiClient('/api/v1/workspace', {
    method: 'POST',
    body: JSON.stringify({ name, description, mode })
  });
}

export async function updateWorkspace(workspaceId, workspaceData) {
  return apiClient(`/api/v1/workspace/${workspaceId}`, {
    method: 'PUT',
    body: JSON.stringify(workspaceData)
  });
}

export async function deleteWorkspace(workspaceId) {
  return apiClient(`/api/v1/workspace/${workspaceId}`, {
    method: 'DELETE'
  });
}
