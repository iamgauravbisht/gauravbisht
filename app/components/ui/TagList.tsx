type Props = {
  tags: string[];
  className?: string;
  prefix?: string;
};

export default function TagList({ tags, className = "", prefix = "" }: Props) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
        >
          {prefix}
          {tag}
        </span>
      ))}
    </div>
  );
}
