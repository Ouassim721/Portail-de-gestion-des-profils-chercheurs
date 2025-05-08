import React from 'react';
import {
  BookOpenIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  DocumentTextIcon,
  LockClosedIcon,
  CloudIcon,
  CodeBracketIcon,
  AcademicCapIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  const content = {
    title: "À propos de ScholarHub",
    subtitle: "Portail de gestion des profils chercheurs - Rapport PFE 2024/2025",
    
    mission: {
      title: "Notre Mission",
      icon: <BookOpenIcon className="h-10 w-10 text-[var(--color-primary)] mb-2" />,
      items: [
        "Centraliser et structurer les informations des chercheurs (profils, publications, événements)",
        "Faciliter la recherche et le partage d'informations scientifiques",       
        "Faciliter les collaborations scientifiques interdisciplinaires",
        "Automatiser la mise à jour via sources externes (Scopus)"
      ]
    },

    features: {
      title: "Fonctionnalités Clés",
      functional: {
        title: "Fonctionnalités Principales",
        icon: <DocumentTextIcon className="h-10 w-10 text-[var(--color-secondary)] mb-2" />,
        items: [
          "CRUD complet des profils et publications",
          "Import automatisé depuis Scopus",
          "Génération dynamique de CVthèques",
          "Alertes personnalisées pour appels à projets",
          "Recherche multicritères avec filtres dynamiques",
          "Tableau de bord avec statistiques temps réel",
          "Design responsive et accessible (WCAG 2.1)"
        ]
      },
      security: {
        title: "Sécurité & Conformité",
        icon: <LockClosedIcon className="h-10 w-10 text-[var(--color-primary)] mb-2" />,
        items: [
          "Authentification JWT sécurisée",
          "Chiffrement AES-256 des données sensibles",
          "Protection contre XSS/CSRF/SQL Injection",
          "Conformité RGPD stricte",
          "Gestion fine des permissions (3 rôles)",
          "Sauvegardes automatisées et chiffrées"
        ]
      }
    },

    architecture: {
      title: "Architecture Technique",
      sections: [
        {
          id: 'frontend',
          title: "Frontend",
          icon: <CodeBracketIcon className="h-12 w-12 text-[var(--color-primary)] mb-4" />,
          features: [
            "React 19 + Server Components",
            "Tailwind CSS 3.3 + Vite",
            "figma pour le design",
          ]
        },
        {
          id: 'backend',
          title: "Backend",
          icon: <CommandLineIcon className="h-12 w-12 text-[var(--color-primary)] mb-4" />,
          features: [
            "Laravel 11 (PHP 8.3)",
            "API REST avec Sanctum/JWT",
            "Intégration Scopus API",
          ]
        },
        {
          id: 'database',
          title: "Persistance",
          icon: <CloudIcon className="h-12 w-12 text-[var(--color-primary)] mb-4" />,
          features: [
            "MySQL 8.2 Clusterisé",
            "Migrations Eloquent ORM",
            "Stockage S3 pour documents"
          ]
        }
      ]
    },

    team: {
      title: "Équipe du Projet",
      members: [
        {
          name: "Badreddine BENHILA",
          role: "Développeur Full-Stack",
          responsibility: "Interface utilisateur & UX"
        },
        {
          name: "Ouassim DERJA",
          role: "Développeur Full-Stack",
          responsibility: "Architecture backend & Sécurité"
        },
        {
          name: "Mr. Benamrane",
          role: "Encadrant Pédagogique",
          responsibility: "Supervision générale"
        },
        {
          name: "Mr. Mourdi",
          role: "Encadrant Technique",
          responsibility: "Validation architecture"
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* En-tête */}
      <div className="bg-[var(--color-primary)] text-[var(--color-white)] py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
          <p className="text-xl text-[var(--color-gray)] max-w-3xl">{content.subtitle}</p>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* Section Mission */}
        <section>
          <div className="flex items-center mb-6">
            {content.mission.icon}
            <h2 className="text-3xl font-bold text-[var(--color-primary)] ml-2">
              {content.mission.title}
            </h2>
          </div>
          <div className="bg-[var(--color-bg-primary)] p-8 rounded-xl shadow-lg">
            <ul className="list-disc pl-6 space-y-4 text-[var(--color-text-primary)] text-lg">
              {content.mission.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section Fonctionnalités */}
        <section>
          <h2 className="text-3xl font-bold mb-12 text-[var(--color-primary)]">
            {content.features.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Fonctionnalités Principales */}
            <div className="bg-[var(--color-bg-primary)] p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {content.features.functional.icon}
                <h3 className="text-2xl font-semibold text-[var(--color-secondary)] ml-2">
                  {content.features.functional.title}
                </h3>
              </div>
              <ul className="space-y-3 text-[var(--color-text-primary)]">
                {content.features.functional.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <AcademicCapIcon className="h-6 w-6 text-[var(--color-secondary)] mr-2 mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sécurité & Conformité */}
            <div className="bg-[var(--color-bg-primary)] p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                {content.features.security.icon}
                <h3 className="text-2xl font-semibold text-[var(--color-primary)] ml-2">
                  {content.features.security.title}
                </h3>
              </div>
              <ul className="space-y-3 text-[var(--color-text-primary)]">
                {content.features.security.items.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <ShieldCheckIcon className="h-6 w-6 text-[var(--color-primary)] mr-2 mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section Architecture */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary)]">
            {content.architecture.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {content.architecture.sections.map((sec) => (
              <div key={sec.id} className="bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-lg">
                {sec.icon}
                <h3 className="text-xl font-semibold mb-3 text-[var(--color-primary)]">
                  {sec.title}
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-[var(--color-text-primary)]">
                  {sec.features.map((feat, idx) => (
                    <li key={idx}>{feat}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section Équipe */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary)]">
            {content.team.title}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.team.members.map((mem, i) => (
              <div key={i} className="bg-[var(--color-bg-primary)] p-6 rounded-xl shadow-md text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-[var(--color-bg-secondary)]" />
                <h4 className="text-xl font-semibold text-[var(--color-primary)]">{mem.name}</h4>
                <p className="mb-2 text-[var(--color-text-secondary)]">{mem.role}</p>
                <p className="text-sm text-[var(--color-gray)]">{mem.responsibility}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;