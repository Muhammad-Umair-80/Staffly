import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

function RatingStars({ value }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="feedback-rating" aria-hidden>
      {stars.map((s) => (
        <span key={s} className={`star ${s <= value ? 'filled' : ''}`}>
          {s <= value ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

export default function FeedbackList({ employeeId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      const response = await axios.get(`${API_BASE}/api/employees/${employeeId}/feedback`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      setFeedback(response.data?.feedback || []);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) load();
  }, [employeeId]);

  const handleDelete = async (id) => {
    if (!id) return;
    if (!confirmDelete) {
      setConfirmDelete(id);
      return;
    }

    setDeletingId(id);
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      await axios.delete(`${API_BASE}/api/feedback/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      toast.success('Feedback deleted');
      await load();
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to delete feedback';
      toast.error(message);
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return <div className="content-state">Loading feedback...</div>;
  }

  if (error) {
    return (
      <div className="content-state content-state--error">
        <h3>Unable to load feedback.</h3>
        <button type="button" className="secondary-button" onClick={load}>
          Retry
        </button>
      </div>
    );
  }

  if (!feedback || feedback.length === 0) {
    return (
      <div className="content-state">
        <p>No feedback yet.</p>
      </div>
    );
  }

  return (
    <div className="feedback-list">
      {feedback.map((f) => (
        <div key={f._id} className="feedback-card">
          <div className="feedback-card__header">
            <RatingStars value={f.rating} />
            <div className="feedback-meta">
              <strong>{f.givenBy?.email || 'Admin'}</strong>
              <span>{new Date(f.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              {confirmDelete === f._id ? (
                <>
                  <button type="button" className="secondary-button" onClick={() => setConfirmDelete(null)} disabled={deletingId === f._id}>
                    Cancel
                  </button>
                  <button type="button" className="danger-button" onClick={() => handleDelete(f._id)} disabled={deletingId === f._id}>
                    {deletingId === f._id ? 'Deleting...' : 'Delete'}
                  </button>
                </>
              ) : (
                <button type="button" className="secondary-button" onClick={() => setConfirmDelete(f._id)}>
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="feedback-card__body">
            <p>{f.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
