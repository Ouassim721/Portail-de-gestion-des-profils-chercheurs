import { BeatLoader } from "react-spinners";

export default function Loader({
  color = "var(--color-primary)",
  size = 15,
  className = "",
}) {
  return (
    <div
      className={`fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-[var(--color-bg-secondary)] z-50 ${className}`}
    >
      <BeatLoader color={color} size={size} />
    </div>
  );
}
