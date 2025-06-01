import { Show } from "solid-js";
import { useNavigate, useLocation } from "@solidjs/router";
import "./Back.css";

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  function goBackAndRefresh() {
    if (location.pathname !== "/") {
      navigate(-1); // Navigasi ke halaman sebelumnya

      // Tunggu sebentar, lalu paksa refresh
      setTimeout(() => {
        window.location.reload(); // ← ini yang benar
      }, 150);
    }
  }

  return (
    <Show when={location.pathname !== "/"}>
      <button
        class="btn btn-dark"
        onClick={goBackAndRefresh}
      >
        <i class="bi-arrow-left me-1" /> Back
      </button>
    </Show>
  );
}
