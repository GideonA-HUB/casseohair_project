interface StarRatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeClasses = {
  sm: 'text-sm gap-0.5',
  md: 'text-lg gap-0.5',
  lg: 'text-2xl gap-1',
};

export default function StarRating({
  value,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  const rounded = Math.round(value);

  return (
    <div className={`inline-flex items-center ${sizeClasses[size]}`} role="img" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < rounded;
        const className = `transition-colors leading-none ${
          filled ? 'text-brand-pink' : 'text-brand-gray-200'
        } ${interactive ? 'cursor-pointer hover:scale-110 hover:text-brand-pink' : ''}`;

        if (interactive && onChange) {
          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(i + 1)}
              className={className}
              aria-label={`Rate ${i + 1} stars`}
            >
              {filled ? '★' : '☆'}
            </button>
          );
        }

        return (
          <span key={i} className={className}>
            {filled ? '★' : '☆'}
          </span>
        );
      })}
    </div>
  );
}
