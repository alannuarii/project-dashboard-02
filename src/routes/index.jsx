import { createSignal, onCleanup, onMount, createEffect } from "solid-js";
import { A } from "@solidjs/router";
import { fetchPltdData } from "~/lib/fetching/pltd";
import { fetchPltsData } from "~/lib/fetching/plts";
import "./index.css";

export default function Home() {
  const [dg1Data, setDg1Data] = createSignal([]);
  const [dg6Data, setDg6Data] = createSignal([]);
  const [dg7Data, setDg7Data] = createSignal([]);
  const [dg8Data, setDg8Data] = createSignal([]);
  const [dg9Data, setDg9Data] = createSignal([]);
  const [lvsw1Data, setLvsw1Data] = createSignal([]);
  const [lvsw2Data, setLvsw2Data] = createSignal([]);
  const [it1Data, setIt1Data] = createSignal([]);
  const [it2Data, setIt2Data] = createSignal([]);
  const [wsData, setWsData] = createSignal([]);
  const [error, setError] = createSignal(null);

  const isDataAvailable = (data) => data && data.length > 0;

  const statusImages = {
    "engine-on": "/img/status/engine-on.png",
    "engine-off": "/img/status/engine-off.png",
    "panel-on": "/img/status/panel-on.png",
    "panel-off": "/img/status/panel-off.png",
    "batt-on": "/img/status/batt-on.png",
    "batt-off": "/img/status/batt-off.png",
    "sun-on": "/img/status/sun-on.png",
    "sun-off": "/img/status/sun-off.png",
  };

  const engines = () => [
    { id: 1, name: "UNIT 1", data: dg1Data },
    { id: 4, name: "UNIT 4", data: () => [] },
    { id: 5, name: "UNIT 5", data: () => [] },
    { id: 6, name: "UNIT 6", data: dg6Data },
    { id: 7, name: "UNIT 7", data: dg7Data },
    { id: 8, name: "UNIT 8", data: dg8Data },
    { id: 9, name: "UNIT 9", data: dg9Data },
  ];

  const solars = () => [
    { name: "PV 1", data: lvsw1Data },
    { name: "PV 2", data: lvsw2Data },
    { name: "BSS 1", data: it1Data },
    { name: "BSS 2", data: it2Data },
  ];

  const frequency = () => {
    if (isDataAvailable(dg9Data())) return dg9Data()[4]._value;
    if (isDataAvailable(dg8Data())) return dg8Data()[4]._value;
    if (isDataAvailable(dg7Data())) return dg7Data()[4]._value;
    if (isDataAvailable(dg6Data())) return dg6Data()[4]._value;
    if (isDataAvailable(lvsw1Data())) return lvsw1Data()[2]._value;
    if (isDataAvailable(lvsw2Data())) return lvsw2Data()[2]._value;
    if (isDataAvailable(dg1Data())) return dg1Data()[4]._value;

    return 0.0;
  };

  onMount(() => {
    const fetchAll = async () => {
      try {
        const { dg1Data: dg1, dg6Data: dg6, dg7Data: dg7, dg8Data: dg8, dg9Data: dg9 } = await fetchPltdData();
        const { lvsw1Data: lvsw1, lvsw2Data: lvsw2, it1Data: it1, it2Data: it2, wsData: ws } = await fetchPltsData();
        setDg1Data(dg1);
        setDg6Data(dg6);
        setDg7Data(dg7);
        setDg8Data(dg8);
        setDg9Data(dg9);
        setLvsw1Data(lvsw1);
        setLvsw2Data(lvsw2);
        setIt1Data(it1);
        setIt2Data(it2);
        setWsData(ws);
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
    <main>
      <Show
        when={error()}
        fallback={
          <div class="row mx-3 text-center">
            <Show
              when={isDataAvailable(dg9Data()) || isDataAvailable(dg8Data()) || isDataAvailable(dg7Data()) || isDataAvailable(dg6Data()) || isDataAvailable(dg1Data()) || isDataAvailable(lvsw1Data()) || isDataAvailable(lvsw2Data())}
              fallback={<h5 class="text-light freq mb-3">00.00 Hz</h5>}
            >
              <h5 class="text-light freq mb-3">{frequency().toFixed(2)} Hz</h5>
            </Show>
            <div className="row">
              <div className="col-6 ">
                <div class="card rounded-0 mb-2">
                  <div class="unit card-header bg-dark text-light">
                    <A href={`/pltd`} class="unit text-light d-block">
                      PLTD TAHUNA
                    </A>
                  </div>
                  <div class="card-body bg-dark-subtle">
                    <Show when={isDataAvailable(dg6Data())} fallback={<h5>0 kW</h5>}>
                      <h5>{((dg1Data()[0]?._value ?? 0) + (dg6Data()[0]?._value ?? 0) + (dg7Data()[0]?._value ?? 0) + (dg8Data()[0]?._value ?? 0) + (dg9Data()[0]?._value ?? 0)).toFixed(0)} kW</h5>
                    </Show>
                  </div>
                </div>
                <div class="row gy-4">
                  <For each={engines()}>
                    {(item) => (
                      <div className="col-3">
                        <div class="card bg-transparent p-3 border rounded-0 border-3">
                          <A href={`/pltd/${item.id}`} class="unit text-light d-block">
                            {item.name}
                          </A>
                          <div class="d-flex justify-content-center align-items-center py-3">
                            <Show when={isDataAvailable(item.data())} fallback={<img src={statusImages["engine-off"]} class="card-img-top" alt="..."></img>}>
                              <img src={statusImages["engine-on"]} class="card-img-top" alt="..."></img>
                            </Show>
                          </div>
                          <div class="py-2 bg-dark-subtle">
                            <h6 class="text-dark">{item.data()[0]?._value.toFixed(0) || 0} kW</h6>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
              <div className="col-6">
                <div class="card rounded-0 mb-2">
                  <div class="unit card-header bg-dark text-light">
                    <A href={"/plts"} class="unit text-light d-block">
                      PLTS SANGIHE
                    </A>
                  </div>
                  <div class="card-body bg-dark-subtle">
                    <Show when={isDataAvailable(dg6Data())} fallback={<h5>0 kW</h5>}>
                      <h5>{((lvsw1Data()[0]?._value ?? 0) + (lvsw2Data()[0]?._value ?? 0)).toFixed(0)} kW</h5>
                    </Show>
                  </div>
                </div>
                <div className="row">
                  <div className="col-4">
                    <div class="card bg-transparent p-3 border rounded-0 border-3">
                      <A href={`/plts/feeder`} class="unit text-light d-block">
                        PV
                      </A>
                      <div class="d-flex justify-content-center align-items-center py-3">
                        <Show when={isDataAvailable(lvsw1Data()) || isDataAvailable(lvsw2Data())} fallback={<img src={statusImages["panel-off"]} class="card-img-top" alt="..."></img>}>
                          <img src={statusImages["panel-on"]} class="card-img-top" alt="..."></img>
                        </Show>
                      </div>
                      <div class="py-2 bg-dark-subtle">
                        <h6 class="text-dark">{((lvsw1Data()[0]?._value ?? 0) + (lvsw2Data()[0]?._value ?? 0)).toFixed(0)} kW</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div class="card bg-transparent p-3 border rounded-0 border-3">
                      <A href={`/plts/bss`} class="unit text-light d-block">
                        BSS
                      </A>
                      <div class="d-flex justify-content-center align-items-center py-3">
                        <Show when={it1Data()[0]?._value <= 0 || it2Data()[0]?._value <= 0} fallback={<img src={statusImages["batt-off"]} class="card-img-top" alt="..."></img>}>
                          <img src={statusImages["batt-on"]} class="card-img-top" alt="..."></img>
                        </Show>
                      </div>
                      <div class="py-2 bg-dark-subtle">
                        <h6 class="text-dark">{((it1Data()[0]?._value ?? 0) + (it2Data()[0]?._value ?? 0)).toFixed(0)} kW</h6>
                      </div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div class="card bg-transparent p-3 border rounded-0 border-3">
                      <A href={`/plts/weatherstation`} class="unit text-light d-block">
                        IRRADIANCE
                      </A>
                      <div class="d-flex justify-content-center align-items-center py-3">
                        <Show when={isDataAvailable(wsData())} fallback={<img src={statusImages["sun-off"]} class="card-img-top" alt="..."></img>}>
                          <img src={statusImages["sun-on"]} class="card-img-top" alt="..."></img>
                        </Show>
                      </div>
                      <div class="py-2 bg-dark-subtle">
                        <h6 class="text-dark">{wsData()[2]?._value.toFixed(0) || 0} kW/m2</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <p class="text-center text-light p-5">Error: {error()}</p>
      </Show>
    </main>
  );
}
