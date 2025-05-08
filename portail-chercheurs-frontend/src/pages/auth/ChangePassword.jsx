import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { LanguageContext } from "../../contexts/LanguageContext";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import ProgressBar from "../../components/ui/ProgressBar";

const ChangePassword = () => {
  const { t } = useContext(LanguageContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/api/change-password",
        {
          current_password: form.currentPassword,
          password: form.newPassword,
          password_confirmation: form.confirmPassword,
        },
        { withCredentials: true }
      );
      setSuccess(t("passwordChangeSuccess"));
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => navigate("/profil-update-form"), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || t("passwordChangeError");
      setError(msg);
    }
  };

  return (
    <>
      <ProgressBar currentStep={0} />
      <div className="max-w-md mx-auto mt-10 bg-[var(--color-bg-primary)] p-8 rounded-xl shadow-md">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label className="block text-[var(--color-text-secondary)] font-medium mb-1">
              {t("currentPasswordLabel")}
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={form.currentPassword}
                onChange={handleChange}
                required
                placeholder={t("currentPasswordPlaceholder")}
                className="w-full px-4 py-2 border rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={
                  showPassword.current ? t("hidePassword") : t("showPassword")
                }
              >
                {showPassword.current ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-[var(--color-gray)] hover:text-gray-400" />
                )}
              </button>
            </div>
          </div>
          {/* New Password */}
          <div>
            <label className="block text-[var(--color-text-secondary)] font-medium mb-1">
              {t("newPasswordLabel")}
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                placeholder={t("newPasswordPlaceholder")}
                className="w-full px-4 py-2 border rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={
                  showPassword.new ? t("hidePassword") : t("showPassword")
                }
              >
                {showPassword.new ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>
          </div>
          {/* Confirm Password */}
          <div>
            <label className="block text-[var(--color-text-secondary)] font-medium mb-1">
              {t("confirmPasswordLabel")}
            </label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder={t("confirmPasswordPlaceholder")}
                className="w-full px-4 py-2 border rounded-lg text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label={
                  showPassword.confirm ? t("hidePassword") : t("showPassword")
                }
              >
                {showPassword.confirm ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                )}
              </button>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}
          <Button className="w-full" type="submit">
            {t("saveButton")}
          </Button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
