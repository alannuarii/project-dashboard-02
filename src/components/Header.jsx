import Timer from "./Timer";

export default function Header() {
  return (
    <nav class="navbar bg-dark fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand text-light fw-bold" href="/">
          <img src="/img/np.png" alt="Logo" height="24" class="d-inline-block align-text-top me-3" />
          <span class="d-none d-md-inline">PLTD Tahuna Super App</span>
        </a>
        <div class="d-flex align-items-center">
          <div class="me-4 d-none d-md-flex">
            <Timer />
          </div>
          <button
            class="logout btn btn-sm btn-danger border-2 border rounded-0 text-light"
            onClick={() => {
              window.location.href = "/api/auth/logout";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
