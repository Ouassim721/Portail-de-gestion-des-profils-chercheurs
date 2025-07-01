import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "@/contexts/LanguageContext";

export default function HelpPage() {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();
  
  return (
    <div className="p-8 max-w-5xl mx-auto text-[var(--color-text-primary)]">
      <section className="mb-10">
        <h1 className="text-4xl font-bold text-[var(--color-primary)] mb-4">
          {t("helpCenterTitle")}
        </h1>
        <p className="text-lg text-[var(--color-text-secondary)]">
          {t("helpCenterWelcome")}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          {t("faqTitle")}
        </h2>
        <ul className="space-y-6 text-[var(--color-text-secondary)]">
          <li>
            <h3 className="font-bold text-lg">❓ {t("howToCreateAccount")}</h3>
            <p className="text-gray-500">
              {t("accountCreationAnswer")}
            </p>
          </li>
          <li>
            <h3 className="font-bold text-lg">
              ❓ {t("howToCreateProfile")}
            </h3>
            <p className="text-gray-500">
              {t("profileCreationAnswer")}
            </p>
          </li>
          <li>
            <h3 className="font-bold text-lg">
              ❓ {t("howToUpdateInfo")}
            </h3>
            <p className="text-gray-500">
              {t("updateInfoAnswer")}
            </p>
          </li>
          <li>
            <h3 className="font-bold text-lg">
              ❓ {t("publicationsNotShowing")}
            </h3>
            <p className="text-gray-500">
              {t("publicationsNotShowingAnswer")}
            </p>
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("quickGuidesTitle")}</h2>
        <div className="space-y-4 text-[var(--color-text-secondary)]">
          <div>
            <h3 className="font-semibold">🧾 {t("profileUpdateGuide")}</h3>
            <p className="text-gray-500">
              {t("profileUpdateSteps")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold ">📄 {t("addPublicationsGuide")}</h3>
            <p className="text-gray-500">
              {t("addPublicationsSteps")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold ">📊 {t("researchStatsGuide")}</h3>
            <p className="text-gray-500">
              {t("researchStatsSteps")}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          {t("needMoreHelp")}
        </h2>
        <p className="text-gray-500 mb-2">
          {t("contactSupportMessage")}
        </p>
        <button
          onClick={() => navigate("/contact")}
          className="text-sm font-semibold text-[var(--color-text-primary)]"
        >
          {t("contactSupport")} <span aria-hidden="true">&rarr;</span>
        </button>
      </section>
    </div>
  );
}