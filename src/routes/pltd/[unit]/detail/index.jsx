import { createSignal, onCleanup, onMount, createEffect, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { fetchUnitData } from "~/lib/fetching/unit";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { updateChart } from "~/lib/utils/chart";

export default function Unit() {
  const params = useParams();
  const [dgData, setDgData] = createSignal([]);
  const [error, setError] = createSignal(null);
  const [selectedChart, setSelectedChart] = createSignal("active");

  // refs canvas untuk semua chart
  let apRef, rpRef, pfRef, frRef, voltRef, currRef;

  // chart instance aktif sekarang
  let currentChart = null;

  // simpan data terbaru untuk update chart
  let latestData = {};

  Chart.register(ChartDataLabels);

  const initChart = (canvasRef, datasetLabels, colors) => {
    return new Chart(canvasRef, {
      type: "line",
      data: {
        labels: [],
        datasets: datasetLabels.map((l, i) => ({
          label: l,
          data: [],
          borderColor: colors[i],
          backgroundColor: colors[i],
          fill: false,
          tension: 0.3,
          datalabels: {
            align: "top",
            anchor: "end",
            color: "#000000",
            font: {
              weight: "bold",
            },
            formatter: (value) => value.toFixed(2),
          },
        })),
      },
      options: {
        plugins: {
          datalabels: {
            display: true,
          },
          legend: {
            labels: {
              color: "#000000",
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false,
            ticks: {
              color: "#000000",
            },
          },
          y: {
            beginAtZero: false,
            ticks: {
              color: "#000000",
            },
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  };

  // fungsi inisialisasi chart sesuai selectedChart
  const createSelectedChart = () => {
    // destroy chart lama kalau ada
    if (currentChart) {
      currentChart.destroy();
      currentChart = null;
    }

    switch (selectedChart()) {
      case "active":
        if (apRef) currentChart = initChart(apRef, ["kW"], ["#4caf50"]);
        break;
      case "reactive":
        if (rpRef) currentChart = initChart(rpRef, ["kVAR"], ["#ff9800"]);
        break;
      case "powerfactor":
        if (pfRef) currentChart = initChart(pfRef, ["PF"], ["#9c27b0"]);
        break;
      case "frequency":
        if (frRef) currentChart = initChart(frRef, ["Hz"], ["#673ab7"]);
        break;
      case "voltage":
        if (voltRef) currentChart = initChart(voltRef, ["L1-L2", "L2-L3", "L3-L1"], ["#2196f3", "#03a9f4", "#00bcd4"]);
        break;
      case "current":
        if (currRef) currentChart = initChart(currRef, ["L1", "L2", "L3"], ["#e91e63", "#9c27b0", "#673ab7"]);
        break;
    }
  };

  // jalankan createSelectedChart saat canvas siap dan saat ganti selectedChart
  createEffect(() => {
    createSelectedChart();
  });

  onMount(() => {
    // fetch data dan update latestData
    const fetchData = () => {
      fetchUnitData(
        params.unit,
        (data) => {
          setDgData(data);
          if (data.length > 0) {
            latestData = {
              ap: data.find((d) => d._field === "Active Power")?._value || 0,
              rp: data.find((d) => d._field === "Reactive Power")?._value || 0,
              pf: data.find((d) => d._field === "Power Factor")?._value || 0,
              fr: data.find((d) => d._field === "Frequency")?._value || 0,
              voltages: [data.find((d) => d._field === "Voltage L1 L2")?._value || 0, data.find((d) => d._field === "Voltage L2 L3")?._value || 0, data.find((d) => d._field === "Voltage L3 L1")?._value || 0],
              currents: [data.find((d) => d._field === "Current L1")?._value || 0, data.find((d) => d._field === "Current L2")?._value || 0, data.find((d) => d._field === "Current L3")?._value || 0],
            };
            // update chart hanya jika chart sudah ada
            if (currentChart) {
              switch (selectedChart()) {
                case "active":
                  updateChart(currentChart, [latestData.ap]);
                  break;
                case "reactive":
                  updateChart(currentChart, [latestData.rp]);
                  break;
                case "powerfactor":
                  updateChart(currentChart, [latestData.pf]);
                  break;
                case "frequency":
                  updateChart(currentChart, [latestData.fr]);
                  break;
                case "voltage":
                  updateChart(currentChart, latestData.voltages);
                  break;
                case "current":
                  updateChart(currentChart, latestData.currents);
                  break;
              }
            }
          }
        },
        setError
      );
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    onCleanup(() => clearInterval(intervalId));
  });

  return (
    <section>
      <Show
        when={error()}
        fallback={
          <section class=" mx-5 py-3 text-center">
            <div class="mb-3 ms-3">
              <h6 class="text-light text-start">Select Parameter:</h6>
              <div class="col-2">
                <select class="form-select rounded-0" value={selectedChart()} onInput={(e) => setSelectedChart(e.currentTarget.value)}>
                  <option value="active">Active Power</option>
                  <option value="reactive">Reactive Power</option>
                  <option value="voltage">Voltage Generator</option>
                  <option value="current">Current Generator</option>
                  <option value="frequency">Frequency</option>
                  <option value="powerfactor">Power Factor</option>
                </select>
              </div>
            </div>

            {/* Hanya render canvas yang dipilih */}
            <Show when={selectedChart() === "active"}>
              <div class="card border-2 border-light rounded-0 mb-2 mx-3" style="height:500px;">
                <div class="card-header bg-dark text-light ">Active Power</div>
                <div class="card-body bg-dark-subtle">
                  <canvas ref={(el) => (apRef = el)}></canvas>
                </div>
              </div>
            </Show>

            <Show when={selectedChart() === "reactive"}>
              <div class="card border-2 border-light rounded-0 mb-2 mx-3" style="height:500px;">
                <div class="card-header bg-dark text-light">Reactive Power</div>
                <div class="card-body bg-dark-subtle">
                  <canvas ref={(el) => (rpRef = el)}></canvas>
                </div>
              </div>
            </Show>

            <Show when={selectedChart() === "voltage"}>
              <div class="card border-2 border-light rounded-0 mb-2 mx-3" style="height:500px;">
                <div class="card-header bg-dark text-light">Voltage Generator</div>
                <div class="card-body bg-dark-subtle">
                  <canvas ref={(el) => (voltRef = el)}></canvas>
                </div>
              </div>
            </Show>

            <Show when={selectedChart() === "current"}>
              <div class="card border-2 border-light rounded-0 mb-2 mx-3" style="height:500px;">
                <div class="card-header bg-dark text-light">Current Generator</div>
                <div class="card-body bg-dark-subtle">
                  <canvas ref={(el) => (currRef = el)}></canvas>
                </div>
              </div>
            </Show>

            <Show when={selectedChart() === "frequency"}>
              <div class="card border-2 border-light rounded-0 mb-2 mx-3" style="height:500px;">
                <div class="card-header bg-dark text-light">Frequency</div>
                <div class="card-body bg-dark-subtle">
                  <canvas ref={(el) => (frRef = el)}></canvas>
                </div>
              </div>
            </Show>

            <Show when={selectedChart() === "powerfactor"}>
              <div class="card border-2 border-light rounded-0 mb-2 mx-3" style="height:500px;">
                <div class="card-header bg-dark text-light">Power Factor</div>
                <div class="card-body bg-dark-subtle">
                  <canvas ref={(el) => (pfRef = el)}></canvas>
                </div>
              </div>
            </Show>
          </section>
        }
      >
        <p class="text-center p-5">Error: {error()}</p>
      </Show>
    </section>
  );
}
