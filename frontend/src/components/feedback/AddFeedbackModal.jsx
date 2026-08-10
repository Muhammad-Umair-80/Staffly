import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

const Star = ({ filled, onClick }) => (
  <button type="button" className={`star ${filled ? 'filled' : ''}`} onClick={onClick} aria-label={`Rate ${filled ? 'filled' : 'empty'}`}>
    {filled ? '★' : '☆'}
  </button>
);

export default function AddFeedbackModal({ employeeId, onClose, onAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!comment.trim()) {
      toast.error('Please enter feedback comment');
      return;
    }

    setSubmitting(true);
    try {
      const token = window.localStorage.getItem('peoplehub-auth-token');
      const response = await axios.post(
        `${API_BASE}/api/employees/${employeeId}/feedback`,
        { rating, comment },
        {
          withCredentials: true,
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      toast.success(response.data?.message || 'Feedback added');
      onAdded && onAdded();
      onClose && onClose();
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to add feedback';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="archive-modal-backdrop" onClick={() => !submitting && onClose && onClose()}>
      <div className="archive-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2>Add Feedback</h2>

        <form className="archive-modal__form" onSubmit={handleSubmit}>
          <label className="archive-modal__field">
            <span>Rating</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} filled={n <= rating} onClick={() => setRating(n)} />
              ))}
            </div>
          </label>

          <label className="archive-modal__field">
            <span>Feedback</span>
            <textarea rows="5" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write feedback..." />
          </label>

          <div className="archive-modal__actions">
            <button type="button" className="secondary-button" onClick={() => onClose && onClose()} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Adding Feedback...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
