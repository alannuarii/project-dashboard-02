import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useParams } from "@solidjs/router";
import { fetchUnitData } from "~/lib/fetching/unit";
import { updateChart, initChart } from "~/lib/utils/chart";
import "./index.css";

export default function Unit() {
  const params = useParams();
  const [dgData, setDgData] = createSignal([]);
  const [error, setError] = createSignal(null);

  const activePowerData = [];
  const reactivePowerData = [];
  const voltageData = [];
  const currentData = [];

  let activePowerChart, reactivePowerChart, voltageChart, currentChart;

  onMount(() => {
    const fetchData = () => {
      fetchUnitData(
        params.unit,
        (data) => {
          setDgData(data);

          if (data.length > 0) {
            const ap = data[0]?._value || 0;
            const rp = data[6]?._value || 0;
            const voltages = [data[7]?._value || 0, data[8]?._value || 0, data[9]?._value || 0];
            const currents = [data[1]?._value || 0, data[2]?._value || 0, data[3]?._value || 0];

            updateChart(activePowerChart, [ap]);
            updateChart(reactivePowerChart, [rp]);
            updateChart(voltageChart, voltages);
            updateChart(currentChart, currents);
          }
        },
        setError
      );
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    onCleanup(() => {
      clearInterval(intervalId);
    });
  });

  const isDataAvailable = (data) => data && data.length > 0;

  let apRef, rpRef, voltRef, currRef;

  onMount(() => {
    activePowerChart = initChart(apRef, "Active Power", activePowerData, ["Active Power (kW)"], ["#4caf50"]);
    reactivePowerChart = initChart(rpRef, "Reactive Power", reactivePowerData, ["Reactive Power (kVAR)"], ["#ff9800"]);
    voltageChart = initChart(voltRef, "Voltage", voltageData, ["L1-L2 (A)", "L2-L3 (A)", "L3-L1 (A)"], ["#2196f3", "#03a9f4", "#00bcd4"]);
    currentChart = initChart(currRef, "Current", currentData, ["L1 (V)", "L2 (V)", "L3 (V)"], ["#e91e63", "#9c27b0", "#673ab7"]);
  });

  return (
    <section>
      <Show
        when={error()}
        fallback={
          <div class="row">
            {/* LEFT: Informasi Unit */}
            <div class="col-4">
              <div class="card bg-dark rounded-0 border-2 border-light p-2 text-center">
                <div class="mb-2">
                  <h5 class="unit text-light d-block">Unit {params.unit}</h5>
                  <Show
                    when={dgData()[0]?._value !== 0 && dgData()[0]?._value !== "N/A"}
                    fallback={dgData()[0]?._value === 0 ? <span class="badge rounded-0 text-bg-warning">Standby</span> : <span class="badge rounded-0 text-bg-secondary">Not Available</span>}
                  >
                    <span class="badge rounded-0 text-bg-success">Operating</span>
                  </Show>
                </div>
                <Show when={isDataAvailable(dgData())} fallback={<h5 class="text-center">Loading</h5>}>
                  <div class="card rounded-0 mb-2 mx-3">
                    <div class="card-header bg-dark text-light">Active Power</div>
                    <div class="card-body bg-dark-subtle">
                      <h6>{dgData()[0]?._value > 0 ? dgData()[0]._value.toFixed(0) : 0} kW</h6>
                    </div>
                  </div>
                  <div class="card rounded-0 mb-2 mx-3">
                    <div class="card-header bg-dark text-light">Reactive Power</div>
                    <div class="card-body bg-dark-subtle">
                      <h6>{dgData()[6]?._value > 0 ? dgData()[6]._value.toFixed(0) : 0} kVAR</h6>
                    </div>
                  </div>
                  <div class="card rounded-0 mb-2 mx-3">
                    <div class="card-header bg-dark text-light">Power Factor</div>
                    <div class="card-body bg-dark-subtle">
                      <h6>{dgData()[5]?._value > 0 ? dgData()[5]._value.toFixed(2) : 0}</h6>
                    </div>
                  </div>

                  <div class="card bg-dark rounded-0 border-0 p-3">
                    <h6 class="text-light mb-2">Voltage Generator</h6>
                    <div class="row gx-0">
                      <div class="col-4">
                        <div class="card rounded-0 d-none d-md-block">
                          <div class="card-header bg-dark text-light">Voltage L1-L2</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>{dgData()[7]?._value > 0 ? dgData()[7]._value.toFixed(2) : 0}</h6>
                          </div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="card rounded-0 d-none d-md-block">
                          <div class="card-header bg-dark text-light">Voltage L2-L3</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>{dgData()[8]?._value > 0 ? dgData()[8]._value.toFixed(2) : 0}</h6>
                          </div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="card rounded-0 d-none d-md-block">
                          <div class="card-header bg-dark text-light">Voltage L3-L1</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>{dgData()[9]?._value > 0 ? dgData()[9]._value.toFixed(2) : 0}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="card bg-dark rounded-0 border-0 p-3">
                    <h6 class="text-light mb-2">Current Generator</h6>
                    <div class="row gx-0">
                      <div class="col-4">
                        <div class="card rounded-0 d-none d-md-block">
                          <div class="card-header bg-dark text-light">Current L1</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>{dgData()[1]?._value > 0 ? dgData()[1]._value.toFixed(2) : 0}</h6>
                          </div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="card rounded-0 d-none d-md-block">
                          <div class="card-header bg-dark text-light">Current L2</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>{dgData()[2]?._value > 0 ? dgData()[2]._value.toFixed(2) : 0}</h6>
                          </div>
                        </div>
                      </div>
                      <div class="col-4">
                        <div class="card rounded-0 d-none d-md-block">
                          <div class="card-header bg-dark text-light">Current L3</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>{dgData()[3]?._value > 0 ? dgData()[3]._value.toFixed(2) : 0}</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Show>
              </div>
            </div>

            {/* RIGHT: Grafik Chart.js */}
            <div class="col-8 text-light text-center">
              <div class="d-flex ms-3">
                <A href={`/pltd/${params.unit}/detail`} class="mb-2 rounded-0 btn btn-sm btn-light">
                  Detail Chart
                </A>
                <A href={`/pltd/${params.unit}/timeframe`} class="mb-2 rounded-0 btn btn-sm btn-light">
                  Timeframe
                </A>
                <A href={`/pltd/${params.unit}/chart`} class="mb-2 rounded-0 btn btn-sm btn-light">
                  Capability Curve
                </A>
              </div>
              <div class="row gx-0 mb-4">
                <div class="col-6">
                  <div class="card border-2 border-light rounded-0 mb-2 mx-3">
                    <div class="card-header bg-dark text-light">Active Power</div>
                    <div class="card-body bg-dark-subtle">
                      <canvas ref={apRef}></canvas>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="card border-2 border-light rounded-0 mb-2 mx-3">
                    <div class="card-header bg-dark text-light">Reactive Power</div>
                    <div class="card-body bg-dark-subtle">
                      <canvas ref={rpRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row gx-0">
                <div class="col-6">
                  <div class="card border-2 border-light rounded-0 mb-2 mx-3">
                    <div class="card-header bg-dark text-light">Voltage Generator</div>
                    <div class="card-body bg-dark-subtle">
                      <canvas ref={voltRef}></canvas>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="card border-2 border-light rounded-0 mb-2 mx-3">
                    <div class="card-header bg-dark text-light">Current Generator</div>
                    <div class="card-body bg-dark-subtle">
                      <canvas ref={currRef}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <p class="text-center p-5">Error: {error()}</p>
      </Show>
    </section>
  );
}
