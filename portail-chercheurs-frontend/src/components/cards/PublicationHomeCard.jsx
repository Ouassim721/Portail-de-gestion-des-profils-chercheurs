export default function PublicationHomeCard({
  title,
  desc,
  author,
  date,
  citations,
}) {
  return (
    <div className="bg-[var(--color-bg-primary)] rounded-2xl shadow p-4 flex flex-col justify-between">
      <h4 className="font-semibold text-base text-[var(--color-text-primary)]">
        {title}
      </h4>
      <p className="text-sm text-[var(--color-text-secondary)]">{desc}</p>
      <div className="flex  justify-between text-sm text-[var(--color-gray)] mt-2">
        <div className="flex flex-col gap-1">
          <p>{author}</p>
          <p>{date}</p>
        </div>
        <div className="text-right flex items-end text-[var(--color-secondary)]">
          <p>{citations} citations</p>
        </div>
      </div>
    </div>
  );
}
