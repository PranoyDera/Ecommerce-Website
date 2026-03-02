import { useState } from "react";

type StarProps = {
  filled: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
};

const Star: React.FC<StarProps> = ({
  filled,
  onMouseEnter,
  onMouseLeave,
  onClick,
}) => {
  return (
    <svg
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "#facc15" : "none"}
      stroke="#facc15"
      strokeWidth={2}
      className="w-8 h-8 cursor-pointer transition"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499a.75.75 0 011.04 0l2.78 2.84 3.92.57a.75.75 0 01.42 1.28l-2.84 2.77.67 3.9a.75.75 0 01-1.09.79L12 13.77l-3.5 1.84a.75.75 0 01-1.09-.79l.67-3.9-2.84-2.77a.75.75 0 01.42-1.28l3.92-.57 2.78-2.84z"
      />
    </svg>
  );
};

type ReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
};

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(0);        // selected rating
  const [hoverRating, setHoverRating] = useState<number>(0); // hover preview
  const [comment, setComment] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (): void => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    onSubmit({ rating, comment });

    // reset
    setRating(0);
    setHoverRating(0);
    setComment("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Write a Review</h2>

        {/* ⭐ Stars */}
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              filled={hoverRating ? star <= hoverRating : star <= rating}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* 📝 Comment Input */}
        <textarea
          className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring"
          rows={4}
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg border"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-medium"
            onClick={handleSubmit}
            type="button"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
