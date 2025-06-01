import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";

export default function PltsPage() {
  const [dg8Data, setDg8Data] = createSignal([]);

  const isDataAvailable = (data) => data && data.length > 0;

  const dgData = (data) => (isDataAvailable(data) ? data : notOperating);

  onMount(() => {
    const fetchData = () =>
      fetchPltdData(
        {
          setDg1Data,
          setDg6Data,
          setDg7Data,
          setDg8Data,
          setDg9Data,
        },
        setError
      );

    fetchAll();
    const interval = setInterval(fetchAll, 1000);
    onCleanup(() => clearInterval(interval));
  });
  return (
    <section class="desktop">
      <div class="container-fluid"></div>
    </section>
  );
}
