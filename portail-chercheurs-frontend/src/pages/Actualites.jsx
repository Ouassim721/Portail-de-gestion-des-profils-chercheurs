import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { Link } from "react-router-dom";
import { LanguageContext } from "../contexts/LanguageContext";
import { fr, enUS } from "date-fns/locale";

const Actualites = () => {
  const { language, t, formatDate } = useContext(LanguageContext);
  const locale = language === "fr" ? fr : enUS;

  // localizer avec date-fns
  const localizer = dateFnsLocalizer({
    format: (date, fmt, opts) => format(date, fmt, { locale, ...opts }),
    parse: (str, fmt, refDate, opts) => parse(str, fmt, refDate, { locale, ...opts }),
    startOfWeek: (date, opts) => startOfWeek(date, { locale, ...opts }),
    getDay: (date) => getDay(new Date(date)),
    locales: { fr, en: enUS },
  });

  const [events, setEvents] = useState([]);
  const [view, setView] = useState("liste");
  const [underlineStyle, setUnderlineStyle] = useState({});
  const listeRef = useRef(null);
  const calendrierRef = useRef(null);

  // Messages pour react-big-calendar
  const calendarMessages = {
    next: t("next"),
    previous: t("previous"),
    today: t("today"),
    month: t("month"),
    week: t("week"),
    day: t("day"),
    agenda: t("agenda"),
    date: t("date"),
    time: t("time"),
    event: t("event"),
    showMore: (total) => `+${total} ${t("showMore")}`,
  };

  // Chargement des actualités
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/actualites", { withCredentials: true })
      .then((res) => {
        setEvents(
          res.data.map((actu) => ({
            id: `${actu.id}`,
            title: `${actu.titre} (${actu.categorie})`,
            start: new Date(actu.date_publication),
            end: new Date(actu.date_publication),
            allDay: true,
            resource: actu,
          }))
        );
      });
  }, []);

  // Calcul de la position du soulignement
  useEffect(() => {
    const activeRef = view === "liste" ? listeRef : calendrierRef;
    if (activeRef.current) {
      const { offsetLeft, offsetWidth } = activeRef.current;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [view]);

  return (
    <div className="md:p-6 bg-[var(--color-bg)] rounded-2xl shadow-md">
      {/* Switcher Liste / Calendrier */}
      <div className="flex space-x-4 border-b border-[var(--color-border)] relative mb-4">
        <button
          ref={listeRef}
          onClick={() => setView("liste")}
          className={`relative pb-2 px-4 text-lg font-medium transition-colors duration-300 ${
            view === "liste"
              ? "text-[var(--color-primary)]"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
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
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
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
        {view === "calendrier" ? (
          <motion.div
            key="calendrier"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              culture={language}
              messages={calendarMessages}
              style={{ height: 600 }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="liste"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            <div className="space-y-4 mt-6">
              {events.map((event) => (
                <Link to={`/actualites/${event.id}`} key={event.id}>
                  <div className="p-4 bg-[var(--color-bg-secondary)] rounded shadow border-l-4 border-[var(--color-primary)]">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {formatDate(event.start, { dateStyle: "long" })}
                    </p>
                    <p className="text-sm text-[var(--color-text-primary)]">
                      {event.resource.categorie}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Actualites;
