// src/routes/plts/bss/index.tsx
import { createSignal, onCleanup, onMount, Show, For, createMemo } from "solid-js";
import { A } from "@solidjs/router";
import { fetchBssData } from "~/lib/fetching/bss";
import "./index.css";

export default function BSSPage() {
  const [bss1Data, setBss1Data] = createSignal([]);
  const [bss2Data, setBss2Data] = createSignal([]);
  const [activeTab, setActiveTab] = createSignal("summary");
  const [currentIndex, setCurrentIndex] = createSignal(0);
  const [activeIndex, setActiveIndex] = createSignal(0);
  const [error, setError] = createSignal(null);

  const isDataAvailable = (data) => data && data.length > 0;

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

  function sortByCapacityAsc(data1, data2) {
    return [...data1, ...data2].sort((a, b) => a.capacity - b.capacity);
  }

  const shortedData = createMemo(() => sortByCapacityAsc(bss1Data(), bss2Data()));

  const next = () => {
    const max = shortedData().length - 1;
    setCurrentIndex((prev) => (prev < max ? prev + 1 : 0));
  };

  const prev = () => {
    const max = shortedData().length - 1;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : max));
  };

  const handleNext = () => {
    if (activeIndex() < shortedData().length - 1) {
      setActiveIndex(activeIndex() + 1);
    }
  };

  const handlePrevious = () => {
    if (activeIndex() > 0) {
      setActiveIndex(activeIndex() - 1);
    }
  };

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
              <div class="col-4">
                <div class="card bg-dark rounded-0 border-2 border-light p-2 text-center">
                  <div class="mb-2">
                    <h5 class="text-light d-block mb-3">Battery Storage System</h5>
                    <Show when={isDataAvailable(bss1Data()) && isDataAvailable(bss2Data())} fallback={<h5 class="text-light mt-3">Loading...</h5>}></Show>
                  </div>
                </div>
              </div>
              <div class="col-8">
                <div class="d-flex ms-3">
                  <A href={`/plts/weatherstation/timeframe`} class="mb-2 rounded-0 btn btn-sm btn-light">
                    Timeframe
                  </A>
                </div>
                <div class="card rounded-0 mb-2 mx-3">
                  <div class="card-header bg-dark text-light">
                    <div class="bg-dark">
                      <button type="button" class={`btn btn-sm rounded-0 ${activeTab() === "summary" ? "btn-secondary" : "btn-light"}`} onClick={() => setActiveTab("summary")}>
                        Summary
                      </button>
                      <button type="button" class={`btn btn-sm rounded-0 ${activeTab() === "bss1" ? "btn-secondary" : "btn-light"}`} onClick={() => setActiveTab("bss1")}>
                        BSS 1
                      </button>
                      <button type="button" class={`btn btn-sm rounded-0 ${activeTab() === "bss2" ? "btn-secondary" : "btn-light"}`} onClick={() => setActiveTab("bss2")}>
                        BSS 2
                      </button>
                    </div>
                  </div>

                  <Show when={isDataAvailable(bss1Data()) && isDataAvailable(bss2Data())} fallback={<h5 class="bg-dark text-light text-center">Loading</h5>}>
                    <div class="card-body bg-dark px-4 text-light">
                      <Show when={activeTab() === "summary"}>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                          <button class="btn btn-sm btn-light rounded-0" onClick={handlePrevious} disabled={activeIndex() === 0}>
                            &laquo; Previous
                          </button>
                          <div class="text-center">
                            <h4 class="fw-bold mb-0">BMS {shortedData()[activeIndex()]?.id_bms}</h4>
                            <p>Ranked by lowest capacity of BMS</p>
                          </div>
                          <button class="btn btn-sm btn-light rounded-0" onClick={handleNext} disabled={activeIndex() >= shortedData().length - 1}>
                            Next &raquo;
                          </button>
                        </div>

                        <label>Capacity</label>
                        <div class="progress mb-3" role="progressbar" aria-valuenow={shortedData()[activeIndex()]?.capacity} aria-valuemin="0" aria-valuemax="100">
                          <div class="progress-bar" style={`width: ${shortedData()[activeIndex()]?.capacity?.toFixed(2) || 0}%`}>
                            {shortedData()[activeIndex()]?.capacity?.toFixed(2) || 0}%
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-4">
                            <For
                              each={[
                                { label: "RUL", value: shortedData()[activeIndex()]?.rul },
                                { label: "SOC", value: shortedData()[activeIndex()]?.soc },
                                {
                                  label: "Temperature",
                                  value: shortedData()[activeIndex()]?.temperature,
                                },
                                {
                                  label: "Min Voltage",
                                  value: shortedData()[activeIndex()]?.min_volt,
                                },
                                {
                                  label: "Max Voltage",
                                  value: shortedData()[activeIndex()]?.max_volt,
                                },
                                {
                                  label: "Avg Voltage",
                                  value: shortedData()[activeIndex()]?.avg_volt,
                                },
                                {
                                  label: "Total Voltage",
                                  value: shortedData()[activeIndex()]?.voltage,
                                },
                              ]}
                            >
                              {(item) => (
                                <div class="row mb-3">
                                  <label class="text-start col-sm-5 col-form-label">{item.label}</label>
                                  <div class="col-sm-6">
                                    <input type="text" class="text-center form-control form-control-sm" value={item.value ?? "-"} disabled />
                                  </div>
                                </div>
                              )}
                            </For>
                          </div>

                          <For each={[0, 1]}>
                            {(col) => (
                              <div class="col-4">
                                <For each={Array.from({ length: 8 }, (_, i) => i + 1 + col * 8)}>
                                  {(cell) => (
                                    <div class="row mb-3">
                                      <label class="text-start col-sm-3 col-form-label">Cell {cell}</label>
                                      <div class="col-sm-6">
                                        <input type="text" class="text-center form-control form-control-sm" value={shortedData()[activeIndex()]?.[`cell${cell}`] ?? "-"} disabled />
                                      </div>
                                    </div>
                                  )}
                                </For>
                              </div>
                            )}
                          </For>
                        </div>
                      </Show>

                      <Show when={activeTab() === "bss1"}>
                        <h5 class="mb-2">BSS Feeder 1</h5>
                        <div class="bss-card-grid">
                          <For each={bss1Data()}>
                            {(data) => (
                              <div class="card bss-card rounded-0">
                                <h6 class="title">BMS {data?.id_bms}</h6>
                                <div class="progress" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                  <div class={`progress-bar ${data?.capacity >= 60 ? "bg-success" : data?.capacity >= 30 ? "bg-warning" : "bg-danger"}`} style={`width: ${data?.capacity.toFixed(2)}%`}>
                                    <span class="capacity">{data?.capacity.toFixed(2)}%</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </For>
                        </div>
                      </Show>

                      <Show when={activeTab() === "bss2"}>
                        <h5 class="mb-2">BSS Feeder 2</h5>
                        <div class="bss-card-grid">
                          <For each={bss2Data()}>
                            {(data) => (
                              <div class="card bss-card rounded-0">
                                <h6 class="title">BMS {data?.id_bms}</h6>
                                <div class="progress" role="progressbar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                  <div class={`progress-bar ${data?.capacity >= 60 ? "bg-success" : data?.capacity >= 30 ? "bg-warning" : "bg-danger"}`} style={`width: ${data?.capacity.toFixed(2)}%`}>
                                    <span class="capacity">{data?.capacity.toFixed(2)}%</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </For>
                        </div>
                      </Show>
                    </div>
                  </Show>
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
