import { queryInfluxDB } from "~/lib/db/influxdb.js";

const token = process.env.TOKEN;
const org = process.env.ORG;
const bucket = process.env.BUCKET;
const url = process.env.URL;

export async function GET({ params }) {
  const { timeframe } = params;

  const aggregateWindow = {
    '1h': '3m',
    '6h': '15m',
    '24h': '1h',
    '3d': '3h',
    '7d': '7h',
    '30d': '24h'
  }[timeframe];

  if (!aggregateWindow) {
    return new Response(JSON.stringify({ error: "Invalid timeframe" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const query = `
    // LVSW1 with max aggregation for specific fields
    lvsw1_max = from(bucket: "${bucket}")
      |> range(start: -${timeframe})
      |> filter(fn: (r) => r._measurement == "LVSW1")
      |> filter(fn: (r) => r._field == "Active Power" or r._field == "Reactive Power" or r._field == "Current")
      |> aggregateWindow(every: ${aggregateWindow}, fn: max, createEmpty: false)

    // LVSW1 with mean aggregation for other fields
    lvsw1_mean = from(bucket: "${bucket}")
      |> range(start: -${timeframe})
      |> filter(fn: (r) => r._measurement == "LVSW1")
      |> filter(fn: (r) => r._field == "Voltage" or r._field == "Power Factor" or r._field == "Frequency")
      |> aggregateWindow(every: ${aggregateWindow}, fn: mean, createEmpty: false)

    // Union both LVSW1 aggregations
    lvsw1 = union(tables: [lvsw1_max, lvsw1_mean])

    // LVSW2 with max aggregation for specific fields
    lvsw2_max = from(bucket: "${bucket}")
      |> range(start: -${timeframe})
      |> filter(fn: (r) => r._measurement == "LVSW2")
      |> filter(fn: (r) => r._field == "Active Power" or r._field == "Reactive Power" or r._field == "Current")
      |> aggregateWindow(every: ${aggregateWindow}, fn: max, createEmpty: false)

    // LVSW2 with mean aggregation for other fields
    lvsw2_mean = from(bucket: "${bucket}")
      |> range(start: -${timeframe})
      |> filter(fn: (r) => r._measurement == "LVSW2")
      |> filter(fn: (r) => r._field == "Voltage" or r._field == "Power Factor" or r._field == "Frequency")
      |> aggregateWindow(every: ${aggregateWindow}, fn: mean, createEmpty: false)

    // Union both LVSW2 aggregations
    lvsw2 = union(tables: [lvsw2_max, lvsw2_mean])

    // Sum fields aggregations as per original logic
    sumFields = union(tables: [lvsw1, lvsw2])
      |> filter(fn: (r) => r._field == "Active Power" or r._field == "Reactive Power" or r._field == "Current")
      |> group(columns: ["_field", "_time"])
      |> sum(column: "_value")

    // Mean fields aggregations as per original logic
    meanFields = union(tables: [lvsw1, lvsw2])
      |> filter(fn: (r) => r._field == "Voltage" or r._field == "Power Factor" or r._field == "Frequency")
      |> group(columns: ["_field", "_time"])
      |> mean(column: "_value")

    // Final union sorted by time
    union(tables: [sumFields, meanFields])
      |> sort(columns: ["_time"])
  `;

  try {
    const result = await queryInfluxDB(token, org, url, query);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Caught error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
