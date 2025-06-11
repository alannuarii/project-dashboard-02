import { queryInfluxDB } from "~/lib/db/influxdb.js";

const token = process.env.TOKEN;
const org = process.env.ORG;
const bucket = process.env.BUCKET;
const url = process.env.URL;

export async function GET({ params }) {
    const { powermeter, timeframe } = params;

    const aggregateWindow = {
        '1h': '3m',
        '6h': '15m',
        '24h': '1h',
        '3d': '3h',
        '7d': '7h',
        '30d': '24h'
    }[timeframe]; 

    const query = `
from(bucket: "${bucket}")
  |> range(start: -${timeframe})
  |> filter(fn: (r) => r._measurement == "${powermeter}")
  |> filter(fn: (r) => 
    r._field == "Active Power" or 
    r._field == "Reactive Power" or 
    r._field == "Voltage" or 
    r._field == "Current" or 
    r._field == "Power Factor" or 
    r._field == "Frequency"
    )
  |> aggregateWindow(every: ${aggregateWindow}, fn: mean, createEmpty: false)
  |> yield(name: "mean")
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
