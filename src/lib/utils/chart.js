import Chart from "chart.js/auto";

export const initChart = (canvasRef, label, dataArray, datasetLabels, colors) => {
    return new Chart(canvasRef, {
        type: "line",
        data: {
            labels: [],
            datasets: datasetLabels.map((l, i) => ({
                label: l,
                data: [],
                borderColor: colors[i],
                fill: false,
                tension: 0.3,
            })),
        },
        options: {
            animation: false,
            scales: {
                x: { display: false },
                y: { beginAtZero: true },
            },
        },
    });
};

export const updateChart = (chart, values) => {
    const now = new Date().toLocaleTimeString();
    chart.data.labels.push(now);
    chart.data.datasets.forEach((ds, i) => {
        ds.data.push(values[i]);
    });

    if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets.forEach((ds) => ds.data.shift());
    }

    let allDataPoints = [];
    chart.data.datasets.forEach((ds) => {
        allDataPoints = allDataPoints.concat(ds.data);
    });

    const minData = Math.min(...allDataPoints);
    const maxData = Math.max(...allDataPoints);
    const padding = (maxData - minData) * 0.1 || 1;

    chart.options.scales.y.min = minData - padding;
    chart.options.scales.y.max = maxData + padding;

    chart.update();
};