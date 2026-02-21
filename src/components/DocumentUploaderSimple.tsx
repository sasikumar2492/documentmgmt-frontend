import React, { useState } from 'react';
import { Button } from './ui/button';
import { documentService } from '../services/documentService';
import { FileText, Upload, X } from 'lucide-react';

interface Props {
  onUploaded?: (documentId: string, htmlContent?: string, originalFileUrl?: string) => void;
}

export const DocumentUploaderSimple: React.FC<Props> = ({ onUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [organizationId, setOrganizationId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      if (!name || !description || !departmentId || !organizationId) {
        setError('All fields (name, description, departmentId, organizationId) are required.');
        setLoading(false);
        return;
      }
      const data = await documentService.uploadDocument(file, {
        name,
        description,
        departmentId,
        organizationId
      });
      // expected: { documentId, originalFileUrl, htmlContent }
      if (onUploaded && data?.documentId) {
        onUploaded(data.documentId, data.htmlContent, data.originalFileUrl);
      }
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-lg font-bold mb-3">Upload .doc / .docx</h2>
      <div className="border border-dashed p-6 rounded-lg mb-4">
        <label className="cursor-pointer flex flex-col items-center gap-3">
          <div className="p-3 bg-slate-50 rounded-full">
            <Upload className="h-6 w-6 text-slate-600" />
          </div>
          <div className="text-sm text-slate-600">
            Click to select a .doc/.docx file (max 50MB)
          </div>
          <input type="file" accept=".doc,.docx" onChange={onFileChange} className="hidden" />
        </label>
      </div>

      {file && (
        <div className="flex items-center justify-between mb-4 p-3 bg-white rounded shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold">{file.name}</div>
              <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</div>
            </div>
          </div>
          <div className="flex-1 ml-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Document name" className="w-full p-2 border rounded"/>
              <input value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} placeholder="Department ID" className="w-full p-2 border rounded"/>
              <input value={organizationId} onChange={(e) => setOrganizationId(e.target.value)} placeholder="Organization ID" className="w-full p-2 border rounded"/>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded col-span-1 md:col-span-2"/>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button onClick={() => setFile(null)} variant="ghost" className="text-slate-600">
              <X className="h-4 w-4" />
            </Button>
            <Button onClick={handleUpload} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      )}

      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
    </div>
  );
};

export default DocumentUploaderSimple;

