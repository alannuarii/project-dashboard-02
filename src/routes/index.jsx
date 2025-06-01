import { A } from "@solidjs/router";

export default function Home() {

  return (
    <main>
      <A href="/pltd" class="btn btn-success">
        PLTD Tahuna
      </A>
      <A href="/plts" class="btn btn-warning">
        PLTS Sangihe
      </A>
    </main>
  );
}
