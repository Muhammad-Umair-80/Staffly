import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const documentTypeLabels = {
  resume: 'Resume',
  contract: 'Contract',
  certificate: 'Certificate',
  'id-document': 'ID Document',
  'offer-letter': 'Offer Letter',
  other: 'Other',
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function DocumentList({ employeeId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadDocuments = async () => {
    setLoading(true);
    setError(false);
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      const response = await axios.get(`${API_BASE}/api/employees/${employeeId}/documents`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      setDocuments(response.data?.documents || []);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      loadDocuments();
    }
  }, [employeeId]);

  const handleDelete = async (id) => {
    if (!confirmDeleteId) {
      setConfirmDeleteId(id);
      return;
    }

    setDeletingId(id);
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      await axios.delete(`${API_BASE}/api/documents/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      toast.success('Document deleted successfully');
      await loadDocuments();
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to delete document';
      toast.error(message);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handleView = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const getFileIcon = () => '📄';

  if (loading) {
    return <div className="content-state">Loading documents...</div>;
  }

  if (error) {
    return (
      <div className="content-state content-state--error">
        <h3>Unable to load documents.</h3>
        <button type="button" className="secondary-button" onClick={loadDocuments}>
          Retry
        </button>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="content-state">
        <p>No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="document-list">
      {documents.map((doc) => (
        <div key={doc._id} className="document-card">
          <div className="document-card__header">
            <div className="document-card__info">
              <div className="document-icon">{getFileIcon()}</div>
              <div>
                <h4 className="document-name">{doc.name}</h4>
                <div className="document-meta">
                  <span className="document-type">{documentTypeLabels[doc.type] || doc.type}</span>
                  <span className="document-date">{formatDate(doc.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="document-card__actions">
              {confirmDeleteId === doc._id ? (
                <>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setConfirmDeleteId(null)}
                    disabled={deletingId === doc._id}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDelete(doc._id)}
                    disabled={deletingId === doc._id}
                  >
                    {deletingId === doc._id ? 'Deleting...' : 'Delete'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => handleView(doc.fileUrl)}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setConfirmDeleteId(doc._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
