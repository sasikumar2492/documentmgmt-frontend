import { apiClient } from '../api/axios';

export const documentService = {
  async uploadDocument(file: File, meta?: { name?: string; description?: string; departmentId?: string; organizationId?: string }) {
    const allowed = ['doc', 'docx'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowed.includes(ext)) {
      throw new Error('INVALID_FILE_TYPE');
    }
    const maxBytes = 50 * 1024 * 1024; // 50MB
    if (file.size > maxBytes) {
      throw new Error('FILE_TOO_LARGE');
    }

    const form = new FormData();
    form.append('file', file);
    // append optional metadata fields if provided
    if (meta) {
      if (meta.name) form.append('name', meta.name);
      if (meta.description) form.append('description', meta.description);
      if (meta.departmentId) form.append('departmentId', meta.departmentId);
      if (meta.organizationId) form.append('organizationId', meta.organizationId);
    }
    // Use centralized apiClient (adds Authorization + refresh)
    const resp = await apiClient.post('/templates/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return resp.data;
  },

  async getDocument(documentId: string) {
    // Per API docs, fetch template by id
    const resp = await apiClient.get(`/templates/${documentId}`);
    return resp.data;
  },

  async updateDocument(documentId: string, htmlContent: string) {
    // Use PATCH to update template metadata/content as per API collection
    const resp = await apiClient.patch(`/templates/${documentId}`, { htmlContent });
    return resp.data;
  }
};

export default documentService;

