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
// import { registerLocale } from "react-datepicker";

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
    <div className="md:p-6 bg-white rounded-2xl shadow-md text-xs sm:text-sm md:text-base 2xl:text:lg">
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

        {/* Barre sous le bouton actif */}
        <span
          className="absolute bottom-0 h-1 bg-[var(--color-primary)] transition-all duration-300 ease-in-out"
          style={{
            left: underlineStyle.left,
            width: underlineStyle.width,
          }}
        />
      </div>

      {/* Transitions lisses entre les vues */}
      <AnimatePresence mode="wait">
        {view === "calendrier" && (
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
            />
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
                    className="p-4 bg-white rounded shadow border-l-4 border-[var(--color-primary)]"
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
