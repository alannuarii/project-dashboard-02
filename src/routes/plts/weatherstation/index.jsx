import { createSignal, onCleanup, onMount, createEffect } from "solid-js";
import { A } from "@solidjs/router";
import { fetchWSData } from "~/lib/fetching/weatherstation";
import { fetchPMData } from "~/lib/fetching/pmPlts";
import { fetchGoogleWeather } from "~/lib/fetching/googleWeather";
import { updateChart, initChart } from "~/lib/utils/chart";
import "./index.css";

export default function WeatherStationPage() {
  const [wsData, setWsData] = createSignal([]);
  const [lvsw1Data, setLvsw1Data] = createSignal([]);
  const [lvsw2Data, setLvsw2Data] = createSignal([]);
  const [googleWeatherData, setGoogleWeatherData] = createSignal(null);
  const [error, setError] = createSignal(null);
  let irradianceChart;
  let canvasRef;

  const isDataAvailable = (data) => data && data.length > 0;

  const fetchWS = async () => {
    try {
      const ws = await fetchWSData();
      setWsData(ws);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    }
  };

  const fetchGW = async () => {
    try {
      const data = await fetchGoogleWeather();
      setGoogleWeatherData(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch Google Weather error:", err);
    }
  };

  const fetchLvsw = async () => {
    try {
      const data1 = await fetchPMData("LVSW1");
      const data2 = await fetchPMData("LVSW2");
      setLvsw1Data(data1);
      setLvsw2Data(data2);
    } catch (err) {
      setError(err.message);
      console.error("Fetch Google Weather error:", err);
    }
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

  createEffect(() => {
    const irradianceData = wsData();
    const lvsw1 = lvsw1Data();
    const lvsw2 = lvsw2Data();

    if (irradianceData && irradianceData.length > 2 && lvsw1 && lvsw1.length > 0 && lvsw2 && lvsw2.length > 0 && irradianceChart) {
      const irradiance = irradianceData.find((d) => d._field === "Global Irradiance")?._value || 0;
      const totalLvsw = (lvsw1[0]?._value || 0) + (lvsw2[0]?._value || 0);

      updateChart(
        irradianceChart,
        [irradiance, totalLvsw] // Dua nilai: irradiance dan total LVSW
      );
    }
  });

  onMount(() => {
    fetchWS();
    fetchGW();
    fetchLvsw();
    const wsInterval = setInterval(fetchWS, 1000);
    const lvswInterval = setInterval(fetchLvsw, 1000);
    const googleInterval = setInterval(fetchGW, 60000);
    onCleanup(() => clearInterval(wsInterval));
    onCleanup(() => clearInterval(lvswInterval));
    onCleanup(() => clearInterval(googleInterval));

    // Inisialisasi chart dengan dua dataset
    setTimeout(() => {
      if (canvasRef) {
        irradianceChart = initChart(canvasRef, "Global Irradiance vs Total LVSW", [], ["Global Irradiance", "PLTS"], ["orange", "blue"]);
      }
    }, 500);
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
                    <h5 class="title text-light d-block mb-3">Weather Station</h5>
                    <Show when={isDataAvailable(wsData())} fallback={<h5 class="text-center">Loading</h5>}>
                      <div class="card rounded-0 mb-2 mx-3">
                        <div class="card-header bg-dark text-light">Air Temperature</div>
                        <div class="card-body bg-dark-subtle">
                          <h6>
                            {wsData()[0]?._value.toFixed(0)}
                            {units(wsData()[0]?._field)}
                          </h6>
                        </div>
                      </div>
                      <div class="card rounded-0 mb-2 mx-3">
                        <div class="card-header bg-dark text-light">External Temperature</div>
                        <div class="card-body bg-dark-subtle">
                          <h6>
                            {wsData()[1]?._value.toFixed(0)}
                            {units(wsData()[1]?._field)}
                          </h6>
                        </div>
                      </div>
                      <div class="card rounded-0 mb-2 mx-3">
                        <div class="card-header bg-dark text-light">Global Irradiance</div>
                        <div class="card-body bg-dark-subtle">
                          <h6>
                            {wsData()[2]?._value.toFixed(0)} {units(wsData()[2]?._field)}
                          </h6>
                        </div>
                      </div>
                      <div class="card rounded-0 mb-2 mx-3">
                        <div class="card-header bg-dark text-light">Relative Humidity</div>
                        <div class="card-body bg-dark-subtle">
                          <h6>
                            {wsData()[3]?._value.toFixed(0)}
                            {units(wsData()[3]?._field)}
                          </h6>
                        </div>
                      </div>
                      <div class="card rounded-0 mb-2 mx-3">
                        <div class="card-header bg-dark text-light">Wind Direction</div>
                        <div class="card-body bg-dark-subtle">
                          <h6>
                            {wsData()[4]?._value.toFixed(0)}
                            {units(wsData()[4]?._field)}
                          </h6>
                        </div>
                      </div>
                      <div class="card rounded-0 mb-2 mx-3">
                        <div class="card-header bg-dark text-light">Wind Speed</div>
                        <div class="card-body bg-dark-subtle">
                          <h6>
                            {wsData()[5]?._value.toFixed(0)} {units(wsData()[5]?._field)}
                          </h6>
                        </div>
                      </div>
                    </Show>
                  </div>
                </div>
              </div>
              <div class="col-8">
                <div class="card border-2 border-light rounded-0 mb-2 mx-3">
                  <div class="card-header bg-dark text-light">Global Irradiance</div>
                  <div class="card-body bg-dark-subtle">
                    <canvas ref={(el) => (canvasRef = el)}></canvas>
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
