import { useState, useEffect, useRef, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import axios from "../axios";
import { log, logError } from "@/utils/logger";
import Loader from "@/components/ui/Loader";
import ChercheurAvatar from "@/components/ui/ChercheurAvatar";
import {
  DocumentTextIcon,
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import FilePreview from "../components/FilePreview";
import { LanguageContext } from "@/contexts/LanguageContext";

export default function PublicationDetails() {
  const { id } = useParams();
  const { t } = useContext(LanguageContext);
  const [publication, setPublication] = useState(null);
  const [publicationData, setPublicationsData] = useState([]);
  const [chercheur, setChercheur] = useState(null);
  const [underlineStyle, setUnderlineStyle] = useState({});
  const [view, setView] = useState("abstract");
  const abstractRef = useRef(null);
  const pdfRef = useRef(null);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    const activeRef = view === "abstract" ? abstractRef : pdfRef;
    if (activeRef.current) {
      const { offsetLeft, offsetWidth } = activeRef.current;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [view]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPublication(null);
        setChercheur(null);

        const resPublication = await axios.get(`/publications/${id}`);
        setPublication(resPublication.data);

        const resChercheur = await axios.get(
          `/chercheurs/${resPublication.data.chercheur_id}`
        );
        setChercheur(resChercheur.data);

        const publicationsChercheurResponse = await axios.get(
          `/publications?chercheur_id=${id}&limit=7`
        );
        setPublicationsData(publicationsChercheurResponse.data.data || []);

        if (resPublication.data.pdf_path) {
          const baseUrl = axios.defaults.baseURL;
          const fileUrl =
            resPublication.data.pdf_path_url ||
            `${baseUrl.replace("/api", "")}/storage/${resPublication.data.pdf_path}`;

          log("URL utilisée:", fileUrl);

          setFileInfo({
            name: resPublication.data.pdf_path.split("/").pop(),
            url: fileUrl,
          });
        } else {
          setFileInfo(null);
        }
      } catch (error) {
        logError("Erreur lors du chargement :", error);
      }
    };

    fetchData();
  }, [id]);

  if (!publication || !chercheur) return <Loader />;
  
  const auteurs = publication.auteurs?.split(",").map((nom) => nom.trim());

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-[var(--color-bg-secondary)] min-h-screen">
      <div className="bg-[var(--color-bg-primary)] p-6 rounded-2xl shadow-md flex flex-col justify-between w-full">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] leading-snug hover:underline cursor-pointer mb-6">
            {publication.titre}
          </h1>

          <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] mb-4">
            <div className="flex items-center gap-2">
              <ChercheurAvatar
                chercheur={chercheur}
                size="lg"
                className="w-12 h-12 mx-auto sm:mx-0"
              />
              <div>
                <Link
                  to={`/chercheurs/${chercheur.id}`}
                  className="font-medium text-lg"
                >
                  {t("drPrefix")} {chercheur.prenom} {chercheur.nom}
                </Link>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {chercheur.sprecialisation}
                </p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {publication.date_publication}
              </span>
            </div>
          </div>

          <div className="flex space-x-4 border-b border-gray-300 relative mb-4">
            <button
              ref={abstractRef}
              onClick={() => setView("abstract")}
              className={`relative pb-2 px-4 text-lg font-medium transition-colors duration-300 ${
                view === "abstract"
                  ? "text-[var(--color-primary)]"
                  : "text-gray-400 hover:text-[var(--color-primary)]"
              }`}
            >
              {t("abstract")}
            </button>
            <button
              ref={pdfRef}
              onClick={() => setView("pdf")}
              className={`relative pb-2 px-4 text-lg font-medium transition-colors duration-300 ${
                view === "pdf"
                  ? "text-[var(--color-primary)]"
                  : "text-gray-400 hover:text-[var(--color-primary)]"
              }`}
            >
              PDF
            </button>
            <span
              className="absolute bottom-0 h-1 bg-[var(--color-primary)] transition-all duration-300 ease-in-out"
              style={underlineStyle}
            />
          </div>

          <div className="min-h-[100px]">
            <AnimatePresence mode="wait">
              {view === "abstract" && (
                <motion.div
                  key="abstract"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="text-[var(--color-text-primary)] text-justify leading-relaxed text-base indent-6 ">
                    {publication.abstract}
                  </p>
                </motion.div>
              )}
              {view === "pdf" && (
                <motion.div
                  key="pdf"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
                      <h3 className="text-xl font-medium text-gray-900 mb-3 sm:mb-0">
                        {t("attachedFile")}
                      </h3>
                      <a
                        href={fileInfo?.url}
                        download
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm w-full sm:w-auto justify-center"
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        {t("downloadDocument")}
                      </a>
                    </div>
                  </div>
                  {fileInfo && (
                    <div className="mt-8">
                      <div className="border rounded-lg overflow-hidden h-[500px] flex items-center justify-center bg-gray-50">
                        <iframe
                          src={fileInfo.url}
                          className="w-full h-full"
                          title={t("documentPreview")}
                        />
                      </div>
                    </div>
                  )}
                  {!fileInfo && (
                    <div className="max-w-100 mx-auto mt-8 border rounded-lg overflow-hidden bg-[var(--color-bg-secondary)] p-6 text-center">
                      <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto" />
                      <p className="mt-4 text-lg font-medium text-[var(--color-text-secondary)]">
                        {t("noDocumentAvailable")}
                      </p>
                      <p className="text-[var(--color-gray)]">
                        {t("noPDFForPublication")}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-6 ">
          <h3 className="text-md font-semibold text-[var(--color-text-secondary)] mb-2">
            {t("authorsLabel")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {auteurs.map((nom, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full"
              >
                {nom}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-6 flex gap-5">
          <h3 className="text-md font-semibold text-[var(--color-text-secondary)] mb-2">
            {t("citationCountLabel")} :
          </h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
              {publication.citation_count}
            </span>
          </div>
        </div>
      </div>

      <aside className="w-full lg:w-80 bg-[var(--color-bg-primary)] p-4 rounded-2xl shadow-md">
        <h2 className="text-lg text-center font-semibold mb-4 text-[var(--color-text-primary)]">
          {t("otherPublicationsBy")} {chercheur.nom} {chercheur.prenom}
        </h2>
        <ul className="space-y-3">
          {publicationData.length > 0 ? (
            publicationData.map((pub, index) => (
              <li key={`${pub.id}-${index}`}>
                <Link
                  to={`/details-publication/${pub.id}`}
                  className="text-sm text-blue-500 hover:underline block"
                >
                  {pub.titre}
                </Link>
              </li>
            ))
          ) : (
            <p className="text-gray-500 italic">{t("noMorePublications")}</p>
          )}
        </ul>
      </aside>
    </div>
  );
}