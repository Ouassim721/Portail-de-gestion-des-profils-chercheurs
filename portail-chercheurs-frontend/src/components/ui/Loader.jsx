import { BeatLoader } from "react-spinners";

export default function Loader({ color = "#003366", size = 15 }) {
  return (
    <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-white z-50">
      <BeatLoader color={color} size={size} />
    </div>
  );
}
