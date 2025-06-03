import { createSignal, onCleanup, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { fetchPltsData } from "~/lib/fetching/plts";
import Feeder from "~/components/Feeder";
import WeatherStation from "~/components/WeatherStation";
import Battery from "~/components/Battery";
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
            <div class="row mx-3 text-center">
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
                <div className="row">
                  <div className="col-6">
                    <div class="mb-2">
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
                        <div class="card rounded-0 d-none d-md-block">
                          <div class="card-header bg-dark text-light">Power Factor</div>
                          <div class="card-body bg-dark-subtle">
                            <h6>{lvsw1Data()[3]?._value > 0 ? lvsw1Data()[3]?._value.toFixed(2) : 0}</h6>
                          </div>
                        </div>
                      </Show>
                    </div>
                    <div className="row">
                      <div className="col-6">
                        <Feeder feeder={1} lvswData={lvsw1Data()} />
                      </div>
                      <div className="col-6">
                        <Feeder feeder={2} lvswData={lvsw2Data()} />
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <Battery itData={[it1Data(), it2Data()]} />
                    <WeatherStation wsData={wsData()} units={units} />
                  </div>
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
