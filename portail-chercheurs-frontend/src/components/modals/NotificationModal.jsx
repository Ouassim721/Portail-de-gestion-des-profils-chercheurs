import { useEffect, useState, useContext } from "react";
import axios from "../../axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { LanguageContext } from "../../contexts/LanguageContext";
import * as Dialog from "@radix-ui/react-dialog";

export default function NotificationModal({ show, onClose }) {
  const { t } = useContext(LanguageContext);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (show) {
      fetchNotifications();
    }
  }, [show]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications", {
        params: { unread: false },
        withCredentials: true,
      });
      setNotifications(res.data.data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.post("/notifications/mark-as-read", { ids: [id] });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog.Root open={show} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 focus:outline-none">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-xl font-semibold text-[var(--color-white)]">
                {t("notifications")}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button className="text-gray-300 hover:text-gray-700">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </Dialog.Close>
            </div>

            {isLoading ? (
              <div className="text-center">{t("loading")}...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center text-gray-500">
                {t("noNotifications")}
              </div>
            ) : (
              <div className="h-[500px] max-h-[80vh] overflow-y-auto">
                {" "}
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b ${
                      !notification.is_read ? "bg-blue-50 dark:bg-gray-700" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">{notification.message}</p>
                        <small className="text-gray-500">
                          {new Date(
                            notification.created_at
                          ).toLocaleDateString()}
                        </small>
                      </div>
                      {!notification.is_read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-green-600 hover:text-green-700 ml-4"
                          title={t("markAsRead")}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
