import { createSignal, onMount, onCleanup, createEffect } from "solid-js";
import { useParams } from "@solidjs/router";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { fetchPMTimeframeData } from "~/lib/fetching/plts";

export default function TimeframeBSS() {
  const [data, setLvswData] = createSignal([]);
  const [error, setError] = createSignal(null);
  const [timeframe, setTimeframe] = createSignal("1h");
  const [parameter, setParameter] = createSignal("active");
  let chartInstance = null;
  let chartCanvas;

  // Fungsi untuk fetch data
  const fetchData = async () => {
    try {
      const feeder = useParams().feeder;
      if (feeder === "1") {
        const lvsw = await fetchPMTimeframeData("LVSW1", timeframe());
        setLvswData(lvsw);
        setError(null);
      } else if (feeder === "2") {
        const lvsw = await fetchPMTimeframeData("LVSW2", timeframe());
        setLvswData(lvsw);
        setError(null);
      } else {
        const lvsw = await fetchPMTimeframeData("totlvsw", timeframe());
        setLvswData(lvsw);
        setError(null);
      }
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
            label: "Active Power",
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
      case "active":
        filteredData = newData.filter((d) => d._field === "Active Power");
        label = "Active Power (kW)";
        color = "#4caf50";
        break;

      case "reactive":
        filteredData = newData.filter((d) => d._field === "Reactive Power");
        label = "Reactive Power (kVAR)";
        color = "#ff9800";
        break;

      case "powerfactor":
        filteredData = newData.filter((d) => d._field === "Power Factor");
        label = "Power Factor";
        color = "#9c27b0";
        break;

      case "frequency":
        filteredData = newData.filter((d) => d._field === "Frequency");
        label = "Frequency (Hz)";
        color = "#673ab7";
        break;

      case "voltage":
        filteredData = newData.filter((d) => d._field === "Voltage");
        label = "Voltage (V)";
        color = "#2196f3";
        break;

      case "current":
        filteredData = newData.filter((d) => d._field === "Current");
        label = "Current (m/s)";
        color = "#03a9f4";
        break;

      default:
        filteredData = newData.filter((d) => d._field === "Active Power");
        label = "Active Power (kW)";
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
            <option value="active">Active Power</option>
            <option value="reactive">Reactive Power</option>
            <option value="voltage">Voltage</option>
            <option value="current">Current</option>
            <option value="frequency">Frequency</option>
            <option value="powerfactor">Power Factor</option>
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
          <Show when={parameter() === "active"}>Active Power</Show>
          <Show when={parameter() === "reactive"}>Reactive Power</Show>
          <Show when={parameter() === "powerfactor"}>Power Factor</Show>
          <Show when={parameter() === "frequency"}>Frequency</Show>
          <Show when={parameter() === "voltage"}>Voltage</Show>
          <Show when={parameter() === "current"}>Current</Show>
        </div>
        <div class="card-body bg-dark-subtle p-0">
          <canvas ref={(el) => (chartCanvas = el)} style="display: block; height: 100%; width: 100%;"></canvas>
        </div>
      </div>
    </section>
  );
}
