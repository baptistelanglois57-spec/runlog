import { useNavigate } from "react-router-dom";

import {
  ChevronLeft,
} from "lucide-react";

export default function RecordsHeader() {
  const navigate = useNavigate();

  return (
    <header className="records-page__header">
      <button
        onClick={() => navigate("/tools")}
        className="records-page__back"
      >
        <ChevronLeft size={22} />
      </button>

      <h1>Records</h1>

      <span aria-hidden="true" />
    </header>
  );
}
