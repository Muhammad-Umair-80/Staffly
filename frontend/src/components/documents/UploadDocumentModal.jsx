import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const DOCUMENT_TYPES = [
  { value: 'resume', label: 'Resume' },
  { value: 'contract', label: 'Contract' },
  { value: 'certificate', label: 'Certificate' },
  { value: 'id-document', label: 'ID Document' },
  { value: 'offer-letter', label: 'Offer Letter' },
  { value: 'other', label: 'Other' },
];

export default function UploadDocumentModal({ employeeId, onClose, onUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('resume');
  const [submitting, setSubmitting] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!documentType) {
      toast.error('Please select a document type');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', documentType);

      const token = window.localStorage.getItem('peoplehub-auth-token');
      const response = await axios.post(
        `${API_BASE}/api/employees/${employeeId}/documents`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      toast.success(response.data?.message || 'Document uploaded successfully');
      onUploaded && onUploaded();
      onClose && onClose();
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to upload document';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setDocumentType('resume');
    onClose && onClose();
  };

  return (
    <div className="archive-modal-backdrop" onClick={() => !submitting && handleCancel()}>
      <div className="archive-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>Upload Document</h2>

        <form className="archive-modal__form" onSubmit={handleSubmit}>
          <label className="archive-modal__field">
            <span>Document Type</span>
            <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} disabled={submitting}>
              {DOCUMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <label className="archive-modal__field">
            <span>Select File</span>
            <input
              type="file"
              onChange={handleFileSelect}
              disabled={submitting}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
            />
          </label>

          {selectedFile && (
            <div className="archive-modal__field">
              <span>Selected</span>
              <div style={{ padding: '12px', backgroundColor: '#f1f5f9', borderRadius: '8px', fontSize: '14px' }}>
                {selectedFile.name}
              </div>
            </div>
          )}

          <div className="archive-modal__actions">
            <button type="button" className="secondary-button" onClick={handleCancel} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={submitting || !selectedFile}>
              {submitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
