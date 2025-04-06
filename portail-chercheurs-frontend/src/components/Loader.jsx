import { BeatLoader } from "ract-spinners";

export default function Loader({ color = "#003366", size = 15 }) {
  return (
    <div className="flex items-center justify-center h-25">
      <BeatLoader color={color} size={size} />
    </div>
  );
}
