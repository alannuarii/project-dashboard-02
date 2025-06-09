// src/routes/plts/bss/index.tsx
import { createSignal, onCleanup, onMount, Show, For, createMemo, createEffect, Index } from "solid-js";
import { useParams } from "@solidjs/router";
import { fetchBssData } from "~/lib/fetching/bss";
import "./index.css";

export default function BSSPage() {
  const params = useParams();
  const [bss1Data, setBss1Data] = createSignal([]);
  const [bss2Data, setBss2Data] = createSignal([]);
  const [error, setError] = createSignal(null);

  const isDataAvailable = (data) => data && data.length > 0;

  const index = () => parseInt(params.bms -1 ); // pastikan param-nya angka

  const fetchBSS1 = async () => {
    try {
      const bss = await fetchBssData("bss1");
      setBss1Data(bss);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error BSS1:", err);
    }
  };

  const fetchBSS2 = async () => {
    try {
      const bss = await fetchBssData("bss2");
      setBss2Data(bss);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error BSS2:", err);
    }
  };

  function combineAllData(data1, data2) {
    return [...data1, ...data2];
  }

  const combinedData = createMemo(() => combineAllData(bss1Data(), bss2Data())[index()]);

  createEffect(() => {
    console.log(combinedData());
  });

  onMount(() => {
    fetchBSS1();
    fetchBSS2();
    const bss1Interval = setInterval(fetchBSS1, 1000);
    const bss2Interval = setInterval(fetchBSS2, 1000);
    onCleanup(() => {
      clearInterval(bss1Interval);
      clearInterval(bss2Interval);
    });
  });

  return (
    <section class="desktop">
      <div class="container-fluid">
        <Show
          when={error()}
          fallback={
            <div class="row text-center">
              <div class="col-7">
                <div class="card bg-dark rounded-0 border-2 border-light p-2 text-center">
                  <div class="mb-2">
                    <Show when={isDataAvailable(bss1Data()) && isDataAvailable(bss2Data())} fallback={<h5 class="bg-dark text-light text-center">Loading</h5>}>
                      <h5 class="text-light d-block">BMS {combinedData()?.id_bms}</h5>
                      <div class="card-body bg-dark px-4 text-light">
                        <label>Capacity</label>
                        <div class="progress mb-3" role="progressbar" aria-valuenow={combinedData()?.capacity} aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar" style={`width: ${combinedData()?.capacity.toFixed(2) || 0}%`}>
                            {combinedData()?.capacity.toFixed(2) || 0}%
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-5">
                            <For
                              each={[
                                { label: "RUL (Cycles)", value: combinedData()?.rul },
                                { label: "SOC (%)", value: combinedData()?.soc },
                                {
                                  label: "Temperature (°C)",
                                  value: combinedData()?.temperature,
                                },
                                {
                                  label: "Min Voltage (V)",
                                  value: combinedData()?.min_volt,
                                },
                                {
                                  label: "Max Voltage (V)",
                                  value: combinedData()?.max_volt,
                                },
                                {
                                  label: "Avg Voltage (V)",
                                  value: combinedData()?.avg_volt,
                                },
                                {
                                  label: "Total Voltage (V)",
                                  value: combinedData()?.voltage,
                                },
                              ]}
                            >
                              {(item) => (
                                <div class="row mb-3">
                                  <label class="text-start col-sm-5 col-form-label">{item.label}</label>
                                  <div class="col-sm-4">
                                    <input type="text" class="text-center form-control form-control-sm" value={item.value ?? "-"} disabled />
                                  </div>
                                </div>
                              )}
                            </For>
                          </div>

                          <For each={[0, 1]}>
                            {(col) => (
                              <div class="col-3">
                                <For each={Array.from({ length: 8 }, (_, i) => i + 1 + col * 8)}>
                                  {(cell) => (
                                    <div class="row mb-3">
                                      <label class="text-start col-sm-5 col-form-label">Cell {cell} (V)</label>
                                      <div class="col-sm-6">
                                        <input type="text" class="text-center form-control form-control-sm" value={combinedData()[`cell${cell}`] ?? "-"} disabled />
                                      </div>
                                    </div>
                                  )}
                                </For>
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    </Show>
                  </div>
                </div>
              </div>
              <div class="col-8"></div>
            </div>
          }
        >
          <p class="text-center text-light p-5">Error: {error()}</p>
        </Show>
      </div>
    </section>
  );
}
