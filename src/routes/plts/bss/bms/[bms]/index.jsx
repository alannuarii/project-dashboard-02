import { createSignal, onCleanup, onMount, Show, For, createMemo, createEffect } from "solid-js";
import { useParams } from "@solidjs/router";
import { fetchBssData } from "~/lib/fetching/bss";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import annotationPlugin from "chartjs-plugin-annotation";
import "./index.css";

export default function BSSPage() {
  const params = useParams();
  const [bss1Data, setBss1Data] = createSignal([]);
  const [bss2Data, setBss2Data] = createSignal([]);
  const [error, setError] = createSignal(null);
  const [voltToCapData, setVoltToCapData] = createSignal([]);
  const [capToRulData, setCapToRulData] = createSignal([]);
  const [activeTab, setActiveTab] = createSignal("volcap");

  let chartVoltToCap = null;
  let chartCapToRul = null;
  let voltCapCanvas;
  let capRulCanvas;

  const index = () => parseInt(params.bms) - 1;

  const isDataAvailable = (data) => data && data.length > 0;

  const fetchBSS1 = async () => {
    try {
      const bss = await fetchBssData("bss1");
      setBss1Data(bss);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchBSS2 = async () => {
    try {
      const bss = await fetchBssData("bss2");
      setBss2Data(bss);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchVoltToCapData = async () => {
    try {
      const response = await fetch("/dataset/volt_to_cap.json");
      const data = await response.json();
      setVoltToCapData(data);
    } catch (err) {
      console.error("Error fetching volt_to_cap data:", err);
    }
  };

  const fetchCapToRulData = async () => {
    try {
      const response = await fetch("/dataset/cap_to_rul.json");
      const data = await response.json();
      setCapToRulData(data);
    } catch (err) {
      console.error("Error fetching cap_to_rul data:", err);
    }
  };

  const combinedData = createMemo(() => {
    const combined = [...bss1Data(), ...bss2Data()];
    return combined[index()];
  });

  Chart.register(annotationPlugin);

  // Effect untuk render chart Voltage to Capacity
  createEffect(() => {
    if (activeTab() !== "volcap") return;

    const data = voltToCapData();
    const combined = combinedData();

    if (data.length > 0 && voltCapCanvas) {
      const ctx = voltCapCanvas.getContext("2d");

      if (chartVoltToCap) {
        chartVoltToCap.destroy();
      }

      chartVoltToCap = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Voltage vs Capacity",
              data: data.map((item) => ({
                x: item.Voltage,
                y: item.Capacity,
              })),
              borderColor: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.5)",
              pointRadius: 5,
              showLine: true,
              fill: false,
              tension: 0.3,
              order: 1,
            },
            {
              label: "Current BMS Point",
              data: combined
                ? [
                    {
                      x: combined.avg_volt,
                      y: combined.capacity,
                    },
                  ]
                : [],
              backgroundColor: "red",
              pointRadius: 7,
              pointHoverRadius: 12,
              order: 99,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "linear",
              title: {
                display: true,
                text: "Voltage (V)",
              },
            },
            y: {
              title: {
                display: true,
                text: "Capacity (%)",
              },
            },
          },
          plugins: {
            annotation: {
              annotations: {
                xLine: {
                  type: "line",
                  xMin: combined ? combined.avg_volt : null,
                  xMax: combined ? combined.avg_volt : null,
                  borderColor: "red",
                  borderWidth: 1,
                  borderDash: [6, 6],
                },
                yLine: {
                  type: "line",
                  yMin: combined ? combined.capacity : null,
                  yMax: combined ? combined.capacity : null,
                  borderColor: "red",
                  borderWidth: 1,
                  borderDash: [6, 6],
                },
              },
            },
          },
        },
      });
    }
  });

  // Effect untuk render chart Capacity to RUL
  createEffect(() => {
    if (activeTab() !== "caprul") return;

    const data = capToRulData();
    const combined = combinedData();

    if (data.length > 0 && capRulCanvas) {
      const ctx = capRulCanvas.getContext("2d");

      if (chartCapToRul) {
        chartCapToRul.destroy();
      }

      chartCapToRul = new Chart(ctx, {
        type: "scatter",
        data: {
          datasets: [
            {
              label: "Capacity vs RUL",
              data: data.map((item) => ({
                x: item.Capacity,
                y: item.RUL,
              })),
              borderColor: "#2196f3",
              backgroundColor: "rgba(33, 150, 243, 0.5)",
              pointRadius: 5,
              showLine: true,
              fill: false,
              tension: 0.3,
              order: 1,
            },
            {
              label: "Current BMS Point",
              data: combined
                ? [
                    {
                      x: combined.capacity,
                      y: combined.rul,
                    },
                  ]
                : [],
              backgroundColor: "red",
              pointRadius: 7,
              pointHoverRadius: 12,
              order: 99,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "linear",
              title: {
                display: true,
                text: "Capacity (%)",
              },
            },
            y: {
              title: {
                display: true,
                text: "RUL (Cycles)",
              },
            },
          },
          plugins: {
            annotation: {
              annotations: {
                xLine: {
                  type: "line",
                  xMin: combined ? combined.capacity : null,
                  xMax: combined ? combined.capacity : null,
                  borderColor: "red",
                  borderWidth: 1,
                  borderDash: [6, 6],
                },
                yLine: {
                  type: "line",
                  yMin: combined ? combined.rul : null,
                  yMax: combined ? combined.rul : null,
                  borderColor: "red",
                  borderWidth: 1,
                  borderDash: [6, 6],
                },
              },
            },
          },
        },
      });
    }
  });

  onMount(() => {
    fetchBSS1();
    fetchBSS2();
    fetchVoltToCapData();
    fetchCapToRulData();

    onCleanup(() => {
      if (chartVoltToCap) {
        chartVoltToCap.destroy();
      }
      if (chartCapToRul) {
        chartCapToRul.destroy();
      }
    });
  });

  return (
    <section class="desktop">
      <div class="container-fluid">
        <Show when={!error()} fallback={<p class="text-center text-light p-5">Error: {error()}</p>}>
          <div class="row text-center">
            <div class="col-7">
              <div class="card bg-dark rounded-0 border-2 border-light p-2 text-center">
                <div class="mb-2">
                  <Show when={isDataAvailable(bss1Data()) && isDataAvailable(bss2Data())} fallback={<h5 class="bg-dark text-light text-center">Loading</h5>}>
                    <h5 class="text-light d-block">BMS {combinedData()?.id_bms}</h5>
                    <div class="card-body bg-dark px-4 text-light">
                      <label>Capacity</label>
                      <div class="progress mb-3">
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
                              { label: "Temperature (°C)", value: combinedData()?.temperature },
                              { label: "Min Voltage (V)", value: combinedData()?.min_volt },
                              { label: "Max Voltage (V)", value: combinedData()?.max_volt },
                              { label: "Avg Voltage (V)", value: combinedData()?.avg_volt },
                              { label: "Total Voltage (V)", value: combinedData()?.voltage },
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

            <div class="col-5">
              <div class="card border-2 border-light rounded-0 mb-2 mx-3">
                <div class="card-header bg-dark text-light">
                  <div class="bg-dark">
                    <button type="button" class={`btn btn-sm rounded-0 ${activeTab() === "volcap" ? "btn-secondary" : "btn-light"}`} onClick={() => setActiveTab("volcap")}>
                      Voltage to Capacity
                    </button>
                    <button type="button" class={`btn btn-sm rounded-0 ${activeTab() === "caprul" ? "btn-secondary" : "btn-light"}`} onClick={() => setActiveTab("caprul")}>
                      Capacity to RUL
                    </button>
                  </div>
                </div>
                <Show when={activeTab() === "volcap"}>
                  <div class="card-header bg-dark text-light">Voltage to Capacity</div>
                  <div class="card-body bg-dark-subtle" style="height: 400px;">
                    <canvas ref={(el) => (voltCapCanvas = el)}></canvas>
                  </div>
                </Show>
                <Show when={activeTab() === "caprul"}>
                  <div class="card-header bg-dark text-light">Capacity to RUL</div>
                  <div class="card-body bg-dark-subtle" style="height: 400px;">
                    <canvas ref={(el) => (capRulCanvas = el)}></canvas>
                  </div>
                </Show>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </section>
  );
}
