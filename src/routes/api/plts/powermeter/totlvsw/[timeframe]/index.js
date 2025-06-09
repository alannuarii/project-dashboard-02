import dotenv from 'dotenv';
dotenv.config();

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
    lvsw1 = from(bucket: "${bucket}")
      |> range(start: -${timeframe})
      |> filter(fn: (r) => r._measurement == "LVSW1")
      |> filter(fn: (r) => r._field == "Active Power" or 
                          r._field == "Reactive Power" or 
                          r._field == "Voltage" or 
                          r._field == "Current" or 
                          r._field == "Power Factor" or 
                          r._field == "Frequency")
      |> aggregateWindow(every: ${aggregateWindow}, fn: mean, createEmpty: false)
    
    lvsw2 = from(bucket: "${bucket}")
      |> range(start: -${timeframe})
      |> filter(fn: (r) => r._measurement == "LVSW2")
      |> filter(fn: (r) => r._field == "Active Power" or 
                          r._field == "Reactive Power" or 
                          r._field == "Voltage" or 
                          r._field == "Current" or 
                          r._field == "Power Factor" or 
                          r._field == "Frequency")
      |> aggregateWindow(every: ${aggregateWindow}, fn: mean, createEmpty: false)
    
    // Sum fields
    sumFields = union(tables: [lvsw1, lvsw2])
      |> filter(fn: (r) => r._field == "Active Power" or 
                          r._field == "Reactive Power" or 
                          r._field == "Current")
      |> group(columns: ["_field", "_time"])
      |> sum(column: "_value")
    
    // Mean fields
    meanFields = union(tables: [lvsw1, lvsw2])
      |> filter(fn: (r) => r._field == "Voltage" or 
                          r._field == "Power Factor" or 
                          r._field == "Frequency")
      |> group(columns: ["_field", "_time"])
      |> mean(column: "_value")
    
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
