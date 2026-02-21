import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { documentService } from '../services/documentService';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface Props {
  documentId?: string;
  initialHtml?: string;
  onSaved?: (resp?: any) => void;
}

export const DocumentEditorSimple: React.FC<Props> = ({ documentId, initialHtml, onSaved }) => {
  const [html, setHtml] = useState(initialHtml || '');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (documentId && !initialHtml) {
        setLoading(true);
        try {
          const data = await documentService.getDocument(documentId);
          if (!mounted) return;
          setHtml(data?.htmlContent || data?.content || '');
        } catch (err: any) {
          setError(err?.message || 'Failed to load document');
        } finally {
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, [documentId, initialHtml]);

  const handleSave = async () => {
    if (!documentId) return setError('Missing documentId');
    setSaving(true);
    setError(null);
    try {
      const resp = await documentService.updateDocument(documentId, html);
      if (onSaved) onSaved(resp);
    } catch (err: any) {
      setError(err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Document Editor</h2>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave} className="bg-blue-600 text-white" disabled={saving || !documentId}>
            {saving ? 'Saving...' : 'Save & Update .docx'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-8 bg-white rounded shadow text-center">Loading document...</div>
      ) : (
        <div className="bg-white rounded shadow p-4">
          <CKEditor
            editor={ClassicEditor}
            data={html}
            onReady={(editor: any) => {
              // Optionally configure the editor here
            }}
            onChange={(_event: any, editor: any) => {
              const data = editor.getData();
              setHtml(data);
            }}
          />
        </div>
      )}

      {error && <div className="text-sm text-red-600 mt-3">{error}</div>}
    </div>
  );
};

export default DocumentEditorSimple;

