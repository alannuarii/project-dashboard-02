import { createSignal, onCleanup, onMount, Show } from "solid-js";
import Unit from "~/components/Unit";
import { fetchPltdData } from "~/lib/fetching/pltd";
import "./index.css";

export default function PltdPage() {
  const [dg1Data, setDg1Data] = createSignal([]);
  const [dg6Data, setDg6Data] = createSignal([]);
  const [dg7Data, setDg7Data] = createSignal([]);
  const [dg8Data, setDg8Data] = createSignal([]);
  const [dg9Data, setDg9Data] = createSignal([]);
  const [error, setError] = createSignal(null);

  const isDataAvailable = (data) => data && data.length > 0;

  const dgData = (data) => (isDataAvailable(data) ? data : notOperating);

  const noData = Array(7).fill({ _value: "N/A" });
  const notOperating = [{ _value: 0 }, { _value: 0 }, { _value: 0 }, { _value: 0 }, { _value: 0 }, { _value: "-" }, { _value: 0 }];

  const frequency = () => {
    if (isDataAvailable(dg9Data())) return dg9Data()[4]._value;
    if (isDataAvailable(dg8Data())) return dg8Data()[4]._value;
    if (isDataAvailable(dg7Data())) return dg7Data()[4]._value;
    if (isDataAvailable(dg6Data())) return dg6Data()[4]._value;
    if (isDataAvailable(dg1Data())) return dg1Data()[4]._value;
    return 0.0;
  };

  onMount(() => {
    const fetchAll = async () => {
      try {
        const { dg1Data: dg1, dg6Data: dg6, dg7Data: dg7, dg8Data: dg8, dg9Data: dg9 } = await fetchPltdData();

        setDg1Data(dg1);
        setDg6Data(dg6);
        setDg7Data(dg7);
        setDg8Data(dg8);
        setDg9Data(dg9);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 1000);
    onCleanup(() => clearInterval(interval));
  });

  return (
    <section class="desktop">
      <div class="container-fluid">
        <Show
          when={error()}
          fallback={
            <div class="row mx-3 text-center">
              <Show when={isDataAvailable(dg9Data()) || isDataAvailable(dg8Data()) || isDataAvailable(dg7Data()) || isDataAvailable(dg6Data()) || isDataAvailable(dg1Data())}>
                <h5 class="text-light freq">{frequency().toFixed(2)} Hz</h5>
              </Show>
              <div class="row gx-3">
                <div class="col-md-3 col-6 py-2">
                  <Unit unit={1} dgData={dgData(dg1Data())} />
                </div>
                <div class="col-md-3 col-6 py-2">
                  <Unit unit={4} dgData={dgData(noData)} />
                </div>
                <div class="col-md-3 col-6 py-2">
                  <Unit unit={5} dgData={dgData(noData)} />
                </div>
                <div class="col-md-3 col-6 py-2">
                  <Unit unit={6} dgData={dgData(dg6Data())} />
                </div>
              </div>
              <div class="row gx-3">
                <div class="col-md-3 col-6 py-2">
                  <Unit unit={7} dgData={dgData(dg7Data())} />
                </div>
                <div class="col-md-3 col-6 py-2">
                  <Unit unit={8} dgData={dgData(dg8Data())} />
                </div>
                <div class="col-md-3 col-6 py-2">
                  <Unit unit={9} dgData={dgData(dg9Data())} />
                </div>
              </div>
            </div>
          }
        >
          <p class="text-center text-light p-5">Error: {error()}</p>
        </Show>
      </div>
    </section>
  );
}
