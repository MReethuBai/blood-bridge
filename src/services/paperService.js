import { apiClient } from './apiClient';

export async function uploadPapers(files, workspaceId = 'ws_default') {
  const formData = new FormData();
  formData.append('workspace_id', workspaceId);

  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  return apiClient('/api/v1/upload', {
    method: 'POST',
    body: formData
  });
}

export async function getUploadedPapers() {
  return apiClient('/api/v1/papers');
}

export async function deletePaper(paperId) {
  return apiClient(`/api/v1/paper/${paperId}`, {
    method: 'DELETE'
  });
}
