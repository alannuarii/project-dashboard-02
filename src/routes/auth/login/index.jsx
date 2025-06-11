export default function Login() {
  return (
    <section class="container-fluid d-flex justify-content-center align-items-center w-50 custom-section">
      <div class="card bg-dark p-5 shadow rounded-0">
        <div class="d-flex justify-content-center">
          <img src="/img/np.png" class="img-fluid mb-4 custom-logo" alt="Logo" />
        </div>
        <div class="text-center text-light">
          <h5 class="fw-bold">LOGIN</h5>
          <h6>DASHBOARD PLTD TAHUNA</h6>
        </div>
        <div>
          <button
            class="btn btn-secondary w-100 rounded-0"
            onClick={() => {
              window.location.href = "/api/auth/login";
            }}
          >
            <i class="bi-google me-2"></i>Login with Google Account
          </button>
        </div>
      </div>
    </section>
  );
}
