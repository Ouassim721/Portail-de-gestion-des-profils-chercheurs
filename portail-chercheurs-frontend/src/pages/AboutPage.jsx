import React, { useState, useContext } from "react";
import {
  BookOpenIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  LockClosedIcon,
  CodeBracketIcon,
  CommandLineIcon,
  CloudIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { LanguageContext } from '../contexts/LanguageContext';

const iconsMap = {
  frontend: <CodeBracketIcon className="h-12 w-12 text-[var(--color-primary)] mb-4" />,
  backend: <CommandLineIcon className="h-12 w-12 text-[var(--color-primary)] mb-4" />,
  database: <CloudIcon className="h-12 w-12 text-[var(--color-primary)] mb-4" />
};

const AboutPage = () => {
  const { t } = useContext(LanguageContext);
  const arch = t('architectureSections');

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">

      {/* En-tête */}
      <div className="bg-[var(--color-primary)] text-[var(--color-white)] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('aboutTitle')}</h1>
          <p className="text-xl text-[var(--color-gray)] max-w-3xl">{t('aboutSubtitle')}</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">

        {/* Mission */}
        <section>
          <div className="flex items-center mb-6">
            <BookOpenIcon className="h-10 w-10 text-[var(--color-primary)] mb-2" />
            <h2 className="text-3xl font-bold text-[var(--color-primary)] ml-2">
              {t('missionTitle')}
            </h2>
          </div>
          <div className="bg-[var(--color-bg-primary)] p-8 rounded-xl shadow-lg">
            <ul className="list-disc pl-6 space-y-4 text-[var(--color-text-primary)] text-lg">
              {t('missionItems').map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>
          </div>
        </section>

        {/* Fonctionnalités */}
        <section>
          <h2 className="text-3xl font-bold mb-12 text-[var(--color-primary)]">
            {t('featuresTitle')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">

            {/* Fonctionnalités Principales */}
            <div className="bg-[var(--color-bg-primary)] p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <DocumentTextIcon className="h-10 w-10 text-[var(--color-secondary)] mb-2" />
                <h3 className="text-2xl font-semibold text-[var(--color-secondary)] ml-2">
                  {t('functionalTitle')}
                </h3>
              </div>
              <ul className="space-y-3 text-[var(--color-text-primary)]">
                {t('functionalItems').map((i, idx) => (
                  <li key={idx} className="flex items-start">
                    <AcademicCapIcon className="h-6 w-6 text-[var(--color-secondary)] mr-2 mt-1" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sécurité & Conformité */}
            <div className="bg-[var(--color-bg-primary)] p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <LockClosedIcon className="h-10 w-10 text-[var(--color-primary)] mb-2" />
                <h3 className="text-2xl font-semibold text-[var(--color-primary)] ml-2">
                  {t('securityTitle')}
                </h3>
              </div>
              <ul className="space-y-3 text-[var(--color-text-primary)]">
                {t('securityItems').map((i, idx) => (
                  <li key={idx} className="flex items-start">
                    <ShieldCheckIcon className="h-6 w-6 text-[var(--color-primary)] mr-2 mt-1" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </section>

        {/* Architecture */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary)]">
            {t('architectureTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {arch.map(sec => (
              <div key={sec.id} className="bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-lg">
                {iconsMap[sec.id]}
                <h3 className="text-xl font-semibold mb-3 text-[var(--color-primary)]">
                  {sec.title}
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-[var(--color-text-primary)]">
                  {sec.features.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Équipe */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary)]">
            {t('teamTitle')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t('teamMembers').map((m, idx) => (
              <div key={idx} className="bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-md text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-[var(--color-bg-secondary)]" />
                <h4 className="text-xl font-semibold text-[var(--color-primary)]">{m.name}</h4>
                <p className="mb-2 text-[var(--color-text-secondary)]">{m.role}</p>
                <p className="text-sm text-[var(--color-gray)]">{m.responsibility}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
