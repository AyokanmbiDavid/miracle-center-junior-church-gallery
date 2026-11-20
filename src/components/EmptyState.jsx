import { Church } from "lucide-react";

export default function LoadingScreen({
  message = "Loading gallery...",
}) {
  return (
    <div className="loading-screen">
      <div className="loading-brand">
        <Church size={27} />
      </div>

      <span className="loading-spinner" />

      <p>{message}</p>
    </div>
  );
}