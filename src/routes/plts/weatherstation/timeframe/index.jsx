import { createSignal, onMount, onCleanup, createEffect } from "solid-js";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { fetchWSTimeframeData } from "~/lib/fetching/weatherstation";

export default function Unit() {
  const [data, setWsData] = createSignal([]);
  const [error, setError] = createSignal(null);
  const [timeframe, setTimeframe] = createSignal("1h");
  const [parameter, setParameter] = createSignal("gi");
  let chartInstance = null;
  let chartCanvas;

  // Fungsi untuk fetch data
  const fetchData = async () => {
    try {
      const weatherStation = await fetchWSTimeframeData(timeframe());
      setWsData(weatherStation);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    }
  };

  // Fungsi untuk inisialisasi chart
  const initChart = () => {
    if (!chartCanvas) return;

    const ctx = chartCanvas.getContext("2d");

    // Register plugin ChartDataLabels
    Chart.register(ChartDataLabels);

    chartInstance = new Chart(ctx, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Global Irradiance",
            data: [],
            borderColor: "#4caf50",
            backgroundColor: "#4caf50",
            borderWidth: 2,
            tension: 0.3, // Garis lebih lengkung
            fill: false,
            pointRadius: 3, // Ukuran titik
            pointHoverRadius: 5, // Ukuran titik saat hover
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          datalabels: {
            display: true,
            align: "top",
            anchor: "end",
            color: "#000000",
            font: {
              weight: "bold",
            },
            formatter: (value) => value.y.toFixed(2), // Format 2 digit desimal
          },
          legend: {
            position: "top",
            labels: {
              color: "#000000",
              font: {
                size: 12,
              },
              boxWidth: 12,
              padding: 20,
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "rgba(0,0,0,0.7)",
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 12,
            },
            padding: 12,
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}`;
              },
            },
          },
        },
        scales: {
          x: {
            type: "time",
            time: {
              tooltipFormat: "dd/MM HH:mm",
              displayFormats: {
                hour: "HH:mm",
                day: "dd/MM",
              },
            },
            title: {
              display: true,
              text: "Time",
              color: "#000000",
              font: {
                size: 12,
                weight: "bold",
              },
            },
            grid: {
              display: true,
              color: "rgba(0,0,0,0.1)",
            },
            ticks: {
              color: "#000000",
            },
          },
          y: {
            grid: {
              display: true,
              color: "rgba(0,0,0,0.1)",
            },
            ticks: {
              color: "#000000",
            },
            beginAtZero: false,
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    });
  };

  // Fungsi untuk update chart dengan data baru
  const updateChart = (newData) => {
    if (!chartInstance || !newData) return;

    // Filter data berdasarkan parameter yang dipilih
    let filteredData = [];
    let label = "";
    let color = "#4caf50";

    switch (parameter()) {
      case "gi":
        filteredData = newData.filter((d) => d._field === "Global Irradiance");
        label = "Global Irradiance (W/m2)";
        color = "#4caf50";
        break;

      case "at":
        filteredData = newData.filter((d) => d._field === "Air Temperature");
        label = "Air Temperature (°C)";
        color = "#ff9800";
        break;

      case "et":
        filteredData = newData.filter((d) => d._field === "External Temperature");
        label = "External Temperature (°C)";
        color = "#9c27b0";
        break;

      case "rh":
        filteredData = newData.filter((d) => d._field === "Relative Humidity");
        label = "Relative Humidity (%)";
        color = "#673ab7";
        break;

      case "wd":
        filteredData = newData.filter((d) => d._field === "Wind Direction");
        label = "Wind Direction (°)";
        color = "#2196f3";
        break;

      case "ws":
        filteredData = newData.filter((d) => d._field === "Wind Speed");
        label = "Wind Speed (m/s)";
        color = "#03a9f4";
        break;

      default:
        filteredData = newData.filter((d) => d._field === "Global Irradiance");
        label = "Global Irradiance";
        color = "#4caf50";
    }

    // Format data untuk chart
    const chartData = filteredData.map((d) => ({
      x: new Date(d._time),
      y: d._value,
    }));

    // Update chart untuk single dataset
    chartInstance.data.datasets = [
      {
        label: label,
        data: chartData,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
        datalabels: {
          display: true,
          align: "top",
          anchor: "end",
          color: "#000000",
          font: {
            weight: "bold",
          },
          formatter: (value) => value.y.toFixed(2),
        },
      },
    ];

    chartInstance.update();
  };

  createEffect(() => {
    const currentData = data();
    if (currentData && chartInstance) {
      updateChart(currentData);
    }
  });

  // Lifecycle
  onMount(() => {
    initChart();
    fetchData();
  });

  onCleanup(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  });

  // Effect untuk parameter dan timeframe changes
  createEffect(() => {
    fetchData();
  });

  return (
    <section class="mx-5">
      <div class="mb-3 d-flex ms-3">
        <div>
          <label class="text-light">Parameter:</label>
          <select class="form-select rounded-0" value={parameter()} onChange={(e) => setParameter(e.target.value)}>
            <option value="gi">Global Irradiance</option>
            <option value="at">Air Temperature</option>
            <option value="et">External Temperature</option>
            <option value="rh">Relative Humidity</option>
            <option value="wd">Wind Direction</option>
            <option value="ws">Wind Speed</option>
          </select>
        </div>

        <div>
          <label class="text-light">Timeframe:</label>
          <select class="form-select rounded-0" value={timeframe()} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="1h">1 Jam</option>
            <option value="6h">6 Jam</option>
            <option value="24h">24 Jam</option>
            <option value="3d">3 Hari</option>
            <option value="7d">7 Hari</option>
            <option value="30d">30 Hari</option>
          </select>
        </div>
      </div>

      <div class="card border-2 border-light rounded-0 mb-2 mx-3 text-center" style="height:500px;">
        <div class="card-header bg-dark text-light">
          <Show when={parameter() === "gi"}>Global Irradiance</Show>
          <Show when={parameter() === "at"}>Air Temperature</Show>
          <Show when={parameter() === "et"}>External Temperature</Show>
          <Show when={parameter() === "rh"}>Relative Humidity</Show>
          <Show when={parameter() === "wd"}>Wind Direction</Show>
          <Show when={parameter() === "ws"}>Wind Speed</Show>
        </div>
        <div class="card-body bg-dark-subtle p-0">
          <canvas ref={(el) => (chartCanvas = el)} style="display: block; height: 100%; width: 100%;"></canvas>
        </div>
      </div>
    </section>
  );
}
