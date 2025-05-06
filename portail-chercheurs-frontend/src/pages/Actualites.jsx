import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";

const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format: (date, formatStr, options) =>
    format(date, formatStr, { ...options, locale: fr }),
  parse: (dateString, formatString, backupDate, options) =>
    parse(dateString, formatString, backupDate, { ...options, locale: fr }),
  startOfWeek: (date, options) => startOfWeek(date, { ...options, locale: fr }),
  getDay: (date) => getDay(new Date(date)),
  locales,
});

const Actualites = () => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("liste");
  const [underlineStyle, setUnderlineStyle] = useState({});
  const listeRef = useRef(null);
  const calendrierRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/actualites", { withCredentials: true })
      .then((res) => {
        const formatted = res.data.map((actu) => ({
          id: `${actu.id}`,
          title: `${actu.titre} (${actu.categorie})`,
          start: new Date(actu.date_publication),
          end: new Date(actu.date_publication),
          allDay: true,
          resource: actu,
        }));
        setEvents(formatted);
      });
  }, []);

  useEffect(() => {
    const activeRef = view === "liste" ? listeRef : calendrierRef;
    if (activeRef.current) {
      const { offsetLeft, offsetWidth } = activeRef.current;
      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth,
      });
    }
  }, [view]);

  return (
    <div className="md:p-6 bg-[var(--color-bg-primary)] rounded-2xl shadow-md text-xs sm:text-sm md:text-base 2xl:text:lg">
      <div className="flex space-x-4 border-b border-gray-300 relative mb-4">
        <button
          ref={listeRef}
          onClick={() => setView("liste")}
          className={`relative pb-2 px-4 text-lg font-medium transition-colors duration-300 ${
            view === "liste"
              ? "text-[var(--color-primary)]"
              : "text-gray-600 hover:text-blue-900"
          }`}
        >
          Liste
        </button>
        <button
          ref={calendrierRef}
          onClick={() => setView("calendrier")}
          className={`relative pb-2 px-4 text-lg font-medium transition-colors duration-300 ${
            view === "calendrier"
              ? "text-[var(--color-primary)]"
              : "text-gray-600 hover:text-blue-900"
          }`}
        >
          Calendrier
        </button>

        <span
          className="absolute bottom-0 h-1 bg-[var(--color-primary)] transition-all duration-300 ease-in-out"
          style={{
            left: underlineStyle.left,
            width: underlineStyle.width,
          }}
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
                culture="fr"
                style={{ height: 600 }}
                messages={{
                  next: "Suivant",
                  previous: "Précédent",
                  today: "Aujourd'hui",
                  month: "Mois",
                  week: "Semaine",
                  day: "Jour",
                  agenda: "Agenda",
                  date: "Date",
                  time: "Heure",
                  event: "Événement",
                  showMore: (total) => `+${total} de plus`,
                }}
                eventPropGetter={(event) => ({
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
                        <button
                          type="button"
                          onClick={() => props.onNavigate("PREV")}
                          className="rbc-btn"
                        >
                          Précédent
                        </button>
                        <button
                          type="button"
                          onClick={() => props.onNavigate("TODAY")}
                          className="rbc-btn"
                        >
                          Aujourd'hui
                        </button>
                        <button
                          type="button"
                          onClick={() => props.onNavigate("NEXT")}
                          className="rbc-btn"
                        >
                          Suivant
                        </button>
                      </span>
                      <span className="rbc-toolbar-label">{props.label}</span>
                      <span className="rbc-btn-group">
                        <button
                          type="button"
                          onClick={() => props.onView("month")}
                          className={`rbc-btn ${
                            props.view === "month" ? "rbc-active" : ""
                          }`}
                        >
                          Mois
                        </button>
                        <button
                          type="button"
                          onClick={() => props.onView("week")}
                          className={`rbc-btn ${
                            props.view === "week" ? "rbc-active" : ""
                          }`}
                        >
                          Semaine
                        </button>
                        <button
                          type="button"
                          onClick={() => props.onView("day")}
                          className={`rbc-btn ${
                            props.view === "day" ? "rbc-active" : ""
                          }`}
                        >
                          Jour
                        </button>
                        <button
                          type="button"
                          onClick={() => props.onView("agenda")}
                          className={`rbc-btn ${
                            props.view === "agenda" ? "rbc-active" : ""
                          }`}
                        >
                          Agenda
                        </button>
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
            {/* Styles CSS pour le calendrier */}
            <style>{`
              .custom-calendar .rbc-toolbar {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;
                color: var(--color-text);
              }
              
              .custom-calendar .rbc-toolbar button {
                color: var(--color-text-primary);
                background: none;
                border: 1px solid var(--color-border);
                padding: 5px 10px;
                margin: 0 3px;
                border-radius: 4px;
                transition: all 0.2s;
              }
              
              .custom-calendar .rbc-toolbar button:hover {
                background-color: var(--color-primary);
                color: white;
                border-color: var(--color-primary);
              }
              
              .custom-calendar .rbc-toolbar button.rbc-active {
                background-color: var(--color-primary);
                color: white;
                border-color: var(--color-primary);
              }
              
              .custom-calendar .rbc-toolbar-label {
                font-size: 1.2em;
                font-weight: bold;
                padding: 0 10px;
                color: var(--color-text-primary);
              }
              
              .custom-calendar .rbc-header {
                background-color: var(--color-bg-secondary);
                color: var(--color-text-primary);
                padding: 10px 0;
                border: none;
              }
              
              .custom-calendar .rbc-today {
              border-right: 3px solid #555;
              background-color: transparent;
              }
              
              .custom-calendar .rbc-month-view {
                border: none;
              }
              
              .custom-calendar .rbc-month-row {
              color: var(--color-text-primary);
                border: none;
              }
              
              .custom-calendar .rbc-day-bg + .rbc-day-bg {
                border-left: 1px solid var(--color-border);
              }
              
              .custom-calendar .rbc-off-range-bg {
                background: var(--color-bg-secondary);
              }
              
              .custom-calendar .rbc-button-link {
                color: var(--color-text);
              }
              
              .custom-calendar .rbc-current-time-indicator {
                background-color: var(--color-primary);
              }
            `}</style>
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
              {events.map((event, index) => (
                <Link to={`/actualites/${event.id}`} key={index}>
                  <div
                    key={index}
                    className="p-4 bg-[var(--color-bg-primary)] rounded shadow border-l-4 border-[var(--color-primary)]"
                  >
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {format(event.start, "dd MMMM yyyy", { locale: fr })}
                    </p>
                    <p className="text-sm">{event.resource.categorie}</p>
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
