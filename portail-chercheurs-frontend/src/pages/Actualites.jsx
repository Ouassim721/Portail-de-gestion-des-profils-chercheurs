import React, { useEffect, useRef, useState, useContext, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { fr, enUS } from "date-fns/locale";
import { Link } from "react-router-dom";
import { LanguageContext } from "../contexts/LanguageContext";
import "./Actualites.css";

const localeMap = { fr, en: enUS };

const Actualites = () => {
  const { t, language } = useContext(LanguageContext);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("liste");
  const [underlineStyle, setUnderlineStyle] = useState({});
  const listeRef = useRef(null);
  const calendrierRef = useRef(null);

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
    axios
      .get("http://localhost:8000/api/actualites", { withCredentials: true })
      .then(({ data }) => {
        setEvents(
          data.map((actu) => ({
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

  useEffect(() => {
    const activeRef = view === "liste" ? listeRef : calendrierRef;
    if (activeRef.current) {
      const { offsetLeft, offsetWidth } = activeRef.current;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [view]);

  return (
    <div className="md:p-6 bg-[var(--color-bg-primary)] rounded-2xl shadow-md text-xs sm:text-sm md:text-base 2xl:text-lg">
      <div className="flex space-x-4 border-b border-gray-300 relative mb-4">
        <button
          ref={listeRef}
          onClick={() => setView("liste")}
          className={`relative pb-2 px-4 text-lg font-medium transition-colors duration-300 ${
            view === "liste" ? "text-[var(--color-primary)]" : "text-gray-400 hover:text-[var(--color-primary)]"
          }`}
        >
          {t("list")}
        </button>
        <button
          ref={calendrierRef}
          onClick={() => setView("calendrier")}
          className={`relative pb-2 px-4 text-lg font-medium transition-colors duration-300 ${
            view === "calendrier" ? "text-[var(--color-primary)]" : "text-gray-400 hover:text-[var(--color-primary)]"
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
                    borderRadius: "4px",
                  },
                })}
                components={{
                  toolbar: (props) => (
                    <div className="rbc-toolbar">
                      <span className="rbc-btn-group">
                        <button type="button" onClick={() => props.onNavigate("PREV")} className="rbc-btn">
                          {t("previous")}
                        </button>
                        <button type="button" onClick={() => props.onNavigate("TODAY")} className="rbc-btn">
                          {t("today")}
                        </button>
                        <button type="button" onClick={() => props.onNavigate("NEXT")} className="rbc-btn">
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
                            className={`rbc-btn ${props.view === v ? "rbc-active" : ""}`}
                          >
                            {t(v)}
                          </button>
                        ))}
                      </span>
                    </div>
                  ),
                  event: ({ event }) => (
                    <div className="p-1">
                      <strong>{event.title}</strong>
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
            <div className="space-y-4 mt-6">
              {events.map((event) => (
                <Link to={`/actualites/${event.id}`} key={event.id}>
                  <div className="p-4 bg-[var(--color-bg-primary)] rounded shadow border-l-4 border-[var(--color-primary)] my-2">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      {event.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {format(event.start, t("dateFormat"), { locale: localeMap[language] || fr })}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
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
