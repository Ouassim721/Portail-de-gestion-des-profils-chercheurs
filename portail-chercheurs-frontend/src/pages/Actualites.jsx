import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import Loader from "../components/ui/Loader";
import NewsCard from "../components/cards/NewsCard";
import { motion, AnimatePresence } from "framer-motion";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { fr, enUS } from "date-fns/locale";
import { LanguageContext } from "@/contexts/LanguageContext";
import "./Actualites.css";

const localeMap = { fr, en: enUS };

const Actualites = () => {
  const { t, language, formatDate } = useContext(LanguageContext);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("liste");
  const [underlineStyle, setUnderlineStyle] = useState({});
  const listeRef = useRef(null);
  const calendrierRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(true); // loader

  // Memoize localizer to rebuild when language changes
  const localizer = useMemo(() => {
    const locale = localeMap[language] || fr;
    return dateFnsLocalizer({
      format: (date, fmt, opts) => format(date, fmt, { ...opts, locale }),
      parse: (str, fmt, bd, opts) => parse(str, fmt, bd, { ...opts, locale }),
      startOfWeek: (date, opts) => startOfWeek(date, { ...opts, locale }),
      getDay: (date) => getDay(new Date(date)),
      locales: { [language]: locale },
    });
  }, [language]);

  useEffect(() => {
    const fetchActualites = async () => {
      try {
        setisLoading(true);
        const { data } = await axios.get("/actualites", {
          withCredentials: true,
        });

        const mappedEvents = data.map((actu) => ({
          id: `${actu.id}`,
          title: `${actu.titre}`,
          localisation: `${actu.localisation}`,
          description: `${actu.description}`,
          categorie: `${actu.categorie}`,
          start: new Date(actu.date_publication),
          end: new Date(actu.date_publication),
          allDay: true,
          resource: actu,
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Erreur lors du chargement des actualités :", error);
      } finally {
        setisLoading(false);
      }
    };

    fetchActualites();
  }, []);

  useEffect(() => {
    const activeRef = view === "liste" ? listeRef : calendrierRef;
    if (activeRef.current) {
      const { offsetLeft, offsetWidth } = activeRef.current;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [view]);

  if (isLoading) return <Loader />;

  return (
    <div className="md:p-6 bg-[var(--color-bg-secondary)] rounded-2xl shadow-md text-xs sm:text-sm md:text-base 2xl:text-lg">
      <div className="flex space-x-4 border-b border-gray-300 relative mb-4">
        <button
          ref={listeRef}
          onClick={() => setView("liste")}
          className={`relative pb-2 px-4 text-lg font-medium transition-colors duration-300 ${
            view === "liste"
              ? "text-[var(--color-primary)]"
              : "text-gray-400 hover:text-[var(--color-primary)]"
          }`}
        >
          {t("list")}
        </button>
        <button
          ref={calendrierRef}
          onClick={() => setView("calendrier")}
          className={`relative pb-2 px-4 text-lg font-medium transition-colors duration-300 ${
            view === "calendrier"
              ? "text-[var(--color-primary)]"
              : "text-gray-400 hover:text-[var(--color-primary)]"
          }`}
        >
          {t("calendar")}
        </button>
        <span
          className="absolute bottom-0 h-1 bg-[var(--color-primary)] transition-all duration-300 ease-in-out"
          style={underlineStyle}
        />
      </div>

      <AnimatePresence mode="wait">
        {view === "calendrier" && (
          <motion.div
            key="calendrier"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <div className="custom-calendar">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                culture={language}
                style={{ height: 600 }}
                messages={{
                  next: t("next"),
                  previous: t("previous"),
                  today: t("today"),
                  month: t("month"),
                  week: t("week"),
                  day: t("day"),
                  agenda: t("agenda"),
                  date: t("dateLabel"),
                  time: t("timeLabel"),
                  event: t("event"),
                  showMore: (total) => `+${total} ${t("showMore")}`,
                }}
                eventPropGetter={() => ({
                  style: {
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    border: "none",
                    fontWeight: "300",
                    fontSize: "15px",
                    borderRadius: "4px",
                  },
                })}
                components={{
                  toolbar: (props) => (
                    <div className="rbc-toolbar">
                      <span className="rbc-btn-group">
                        <button
                          type="button"
                          onClick={() => props.onNavigate("PREV")}
                          className="rbc-btn"
                        >
                          {t("previous")}
                        </button>
                        <button
                          type="button"
                          onClick={() => props.onNavigate("TODAY")}
                          className="rbc-btn"
                        >
                          {t("today")}
                        </button>
                        <button
                          type="button"
                          onClick={() => props.onNavigate("NEXT")}
                          className="rbc-btn"
                        >
                          {t("next")}
                        </button>
                      </span>
                      <span className="rbc-toolbar-label">{props.label}</span>
                      <span className="rbc-btn-group">
                        {["month", "week", "day", "agenda"].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => props.onView(v)}
                            className={`rbc-btn ${
                              props.view === v ? "rbc-active" : ""
                            }`}
                          >
                            {t(v)}
                          </button>
                        ))}
                      </span>
                    </div>
                  ),
                  event: ({ event }) => (
                    <div className="p-1">
                      <strong
                        onClick={() => navigate(`/actualites/${event.id}`)}
                      >
                        {event.title}
                      </strong>
                    </div>
                  ),
                }}
              />
            </div>
          </motion.div>
        )}

        {view === "liste" && (
          <motion.div
            key="liste"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <div className="space-y-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8 mt-10">
              {events.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 px-4 text-center">
                  <svg
                    className="w-16 h-16 text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {t("noNewsAvailable")}
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    {t("checkBackLater")}
                  </p>
                </div>
              ) : (
                events.map((event) => (
                  <NewsCard
                    key={event.id}
                    titre={event.title}
                    localisation={event.localisation}
                    description={event.description}
                    categorie={event.categorie}
                    date_publication={formatDate(event.start, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    onClick={() => navigate(`/actualites/${event.id}`)}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Actualites;