import { createSignal, onCleanup, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { fetchPltsData } from "~/lib/fetching/plts";
import "./index.css";

export default function PltsPage() {
  const [lvsw1Data, setLvsw1Data] = createSignal([]);
  const [lvsw2Data, setLvsw2Data] = createSignal([]);
  const [it1Data, setIt1Data] = createSignal([]);
  const [it2Data, setIt2Data] = createSignal([]);
  const [wsData, setWsData] = createSignal([]);
  const [error, setError] = createSignal(null);

  const isDataAvailable = (data) => data && data.length > 0;

  const fetchAll = async () => {
    try {
      const { lvsw1Data: lvsw1, lvsw2Data: lvsw2, it1Data: it1, it2Data: it2, wsData: ws } = await fetchPltsData();

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

  const frequency = () => {
    if (isDataAvailable(lvsw1Data())) return lvsw1Data()[2]._value;
    if (isDataAvailable(lvsw2Data())) return lvsw2Data()[2]._value;
    return 0.0;
  };

  const units = (field) => {
    if (field === "External Temperature" || field === "Air Temperature") {
      return "°C";
    } else if (field === "Global Irradiance") {
      return "W/m2";
    } else if (field === "Wind Direction") {
      return "°";
    } else if (field === "Wind Speed") {
      return "m/s";
    } else if (field === "Relative Humidity") {
      return "%";
    } else if (field.includes("Voltage")) {
      return "V";
    } else if (field.includes("Current")) {
      return "A";
    } else if (field === "Generator Frequency") {
      return "Hz";
    } else if (field === "Power Factor") {
      return "";
    } else if (field === "Active Power") {
      return "kW";
    } else if (field === "Reactive Power") {
      return "kVAR";
    }
  };

  onMount(() => {
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
            <div class="row text-center">
              <Show when={isDataAvailable(lvsw1Data()) || isDataAvailable(lvsw2Data())}>
                <h5 class="text-light freq mb-2">{frequency().toFixed(2)} Hz</h5>
              </Show>
              <div class="card bg-dark rounded-0 border-2 border-light p-2">
                <div class="mb-2">
                  <h5 class="unit text-light d-block">PLTS Sangihe</h5>
                  <Show when={lvsw1Data()[0]?._value > 0} fallback={lvsw1Data()[0]?._value <= 0 ? <span class="badge rounded-0 text-bg-warning">Standby</span> : <span class="badge rounded-0 text-bg-secondary">Not Available</span>}>
                    <span class="badge rounded-0 text-bg-success">Operating</span>
                  </Show>
                </div>
                <Show when={isDataAvailable(lvsw1Data())} fallback={<h5 class="text-center text-light">Loading</h5>}>
                  <div class="card rounded-0 mb-2">
                    <div class="card-header bg-dark text-light">Active Power</div>
                    <div class="card-body bg-dark-subtle">
                      <h6>{lvsw1Data()[0]?._value > 0 ? (lvsw1Data()[0]?._value + lvsw2Data()[0]?._value).toFixed(0) : 0} kW</h6>
                    </div>
                  </div>
                  <div class="card rounded-0 mb-2 d-none d-md-block">
                    <div class="card-header bg-dark text-light">Reactive Power</div>
                    <div class="card-body bg-dark-subtle">
                      <h6>{lvsw1Data()[4]?._value > 0 ? (lvsw1Data()[4]?._value + lvsw2Data()[4]?._value).toFixed(0) : 0} kVAR</h6>
                    </div>
                  </div>
                  <div class="card rounded-0 d-none d-md-block mb-2">
                    <div class="card-header bg-dark text-light">Power Factor</div>
                    <div class="card-body bg-dark-subtle">
                      <h6>{lvsw1Data()[3]?._value > 0 ? lvsw1Data()[3]?._value.toFixed(2) : 0}</h6>
                    </div>
                  </div>
                </Show>
                <div class="card rounded-0 mb-2">
                  <div class="card-header bg-dark text-light">Battery Storage System</div>
                  <div class="card-body bg-dark">
                    <Show when={isDataAvailable(it1Data())} fallback={<h5 class="text-center text-light">Loading</h5>}>
                      <div class="row gx-2 ">
                        <div class="col-6">
                          <div class="card rounded-0 mb-2">
                            <div class="card-header bg-dark text-light">Feeder #1</div>
                            <div class="card-body bg-dark-subtle">
                              <h6>{it1Data()[0]?._value.toFixed(0)} kW</h6>
                            </div>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="card rounded-0 mb-2">
                            <div class="card-header bg-dark text-light">Feeder #2</div>
                            <div class="card-body bg-dark-subtle">
                              <h6>{it2Data()[0]?._value.toFixed(0)} kW</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row gx-2">
                        <div class="col-6">
                          <div class="card rounded-0 mb-2">
                            <div class="card-header bg-dark text-light">Status</div>
                            <div class="card-body bg-dark-subtle">
                              <Show
                                when={it1Data()[0]?._value > 0}
                                fallback={
                                  <Show when={it1Data()[0]?._value <= -1} fallback={<h6>-</h6>}>
                                    <h6>Charging</h6>
                                  </Show>
                                }
                              >
                                <h6>Discharging</h6>
                              </Show>
                            </div>
                          </div>
                        </div>
                        <div class="col-6">
                          <div class="card rounded-0 mb-2">
                            <div class="card-header bg-dark text-light">Status</div>
                            <div class="card-body bg-dark-subtle">
                              <Show
                                when={it2Data()[0]?._value > 0}
                                fallback={
                                  <Show when={it2Data()[0]?._value <= -1} fallback={<h6>-</h6>}>
                                    <h6>Charging</h6>
                                  </Show>
                                }
                              >
                                <h6>Discharging</h6>
                              </Show>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Show>
                  </div>
                </div>
                <div class="card rounded-0 mb-2">
                  <div class="card-header bg-dark text-light">Weather Station</div>
                  <Show when={isDataAvailable(wsData())} fallback={<h5 class="text-center text-light">Loading</h5>}>
                    <div class="card-body bg-dark">
                      <div class="d-flex flex-wrap justify-content-center">
                        <div class="card card-ws rounded-0 mb-2 d-none d-md-block">
                          <div class="card-header bg-dark text-light">Air Temperature</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>
                              {wsData()[0]?._value.toFixed(0)} {units(wsData()[0]?._field)}
                            </h6>
                          </div>
                        </div>
                        <div class="card card-ws rounded-0 mb-2 d-none d-md-block">
                          <div class="card-header bg-dark text-light">External Temperature</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>
                              {wsData()[1]?._value.toFixed(0)} {units(wsData()[1]?._field)}
                            </h6>
                          </div>
                        </div>
                        <div class="card card-ws rounded-0 mb-2">
                          <div class="card-header bg-dark text-light">Global Irradiance</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>
                              {wsData()[2]?._value.toFixed(0)} {units(wsData()[2]?._field)}
                            </h6>
                          </div>
                        </div>
                        <div class="card card-ws rounded-0 mb-2">
                          <div class="card-header bg-dark text-light">Relative Humidity</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>
                              {wsData()[3]?._value.toFixed(0)} {units(wsData()[3]?._field)}
                            </h6>
                          </div>
                        </div>
                        <div class="card card-ws rounded-0 mb-2 d-none d-md-block">
                          <div class="card-header bg-dark text-light">Wind Direction</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>
                              {wsData()[4]?._value.toFixed(0)}
                              {units(wsData()[4]?._field)}
                            </h6>
                          </div>
                        </div>
                        <div class="card card-ws rounded-0 mb-2 d-none d-md-block">
                          <div class="card-header bg-dark text-light text-wrap">Wind Speed</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>
                              {wsData()[5]?._value.toFixed(0)} {units(wsData()[5]?._field)}
                            </h6>
                          </div>
                        </div>
                      </div>
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
