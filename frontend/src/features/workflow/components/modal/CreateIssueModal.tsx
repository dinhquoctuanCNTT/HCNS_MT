import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string }) => void;
};

export default function CreateIssueModal({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Create issue</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button onClick={onClose}>Cancel</button>
          <button
            className="primary"
            onClick={() => {
              onSubmit({ title, description });
              setTitle("");
              setDescription("");
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
