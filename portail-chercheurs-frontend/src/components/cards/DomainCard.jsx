import { LanguageContext } from "../../contexts/LanguageContext";
import { useContext } from "react";

export default function DomainCard({
  title,
  topics,
  researchers,
  publications,
  borderColor,
}) {
  const { t } = useContext(LanguageContext);
  
  return (
    <div
      className={`rounded-2xl border-t-4 ${borderColor} bg-white p-6 shadow`}
    >
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <ul className="text-sm text-gray-600 mb-4 list-disc pl-5">
        {topics.map((topic, idx) => (
          <li key={idx}>{topic}</li>
        ))}
      </ul>
      <div className="text-sm font-medium text-gray-700">
        <span className="mr-4">{researchers} {t("researchers")}</span>
        <span className="text-green-600">{publications} {t("publications")}</span>
      </div>
    </div>
  );
}