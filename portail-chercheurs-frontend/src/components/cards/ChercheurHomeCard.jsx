import ChercheurAvatar from "../ui/ChercheurAvatar";
import { LanguageContext } from "../../contexts/LanguageContext";
import { useContext } from "react";

export default function ChercheurHomeCard({
  name,
  domain,
  publications,
  tag,
  image,
}) {
  const { t } = useContext(LanguageContext);
  
  return (
    <div className="bg-[var(--color-bg-primary)] rounded-xl shadow-card p-4 text-center flex flex-col items-center gap-4">
      <ChercheurAvatar
        chercheur={image}
        size="xl"
        className="w-16 h-16 rounded-full object-cover"
      />
      <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">
        {name}
      </h3>
      <p className="text-[var(--color-text-secondary)]">{domain}</p>
      <div className="flex gap-2 mt-2">
        <span className="bg-[var(--color-primary)] text-white text-sm px-2 py-1 rounded">
          {publications} {t("publications")}
        </span>
        <span
          className={`text-sm px-2 py-1 rounded text-white bg-[var(--color-secondary)]`}
        >
          {tag.label}
        </span>
      </div>
    </div>
  );
}