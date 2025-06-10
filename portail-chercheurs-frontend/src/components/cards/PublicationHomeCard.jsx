export default function PublicationHomeCard({
  title,
  desc,
  author,
  date,
  citations,
  tag,
}) {
  return (
    <div className="bg-[var(--color-bg-primary)] rounded-2xl shadow p-4 flex flex-col justify-between">
      <h4 className="font-semibold text-base text-[var(--color-text-primary)]">
        {title}
      </h4>
      <p className="text-sm text-[var(--color-text-secondary)]">{desc}</p>
      <div className="flex items-center justify-between text-sm text-[var(--color-gray)] mt-2">
        <div className="flex flex-col gap-1">
          <p>{author}</p>
          <p>{date}</p>
        </div>
        <div className="text-right flex flex-col gap-1">
          <p>{citations} citations</p>
          <span className={`text-white px-2 py-1 rounded ${tag.color}`}>
            {tag.label}
          </span>
        </div>
      </div>
    </div>
  );
}
