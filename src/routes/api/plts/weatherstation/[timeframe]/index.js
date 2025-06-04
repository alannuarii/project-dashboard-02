import dotenv from 'dotenv';
dotenv.config();

import { queryInfluxDB } from '../../../../../lib/db/influxdb.js';

const token = process.env.TOKEN;
const org = process.env.ORG;
const bucket = process.env.BUCKET;
const url = process.env.URL;

export async function GET({ params }) {
  const { unit, timeframe } = params;

  const aggregateWindow = {
    '1h': '3m',
    '6h': '15m',
    '24h': '1h',
    '3d': '3h',
    '7d': '7h',
    '30d': '24h'
  }[timeframe] || '5m';

  const query = `
import "influxdata/influxdb/schema"

globalMax = from(bucket: "${bucket}")
  |> range(start: -${timeframe})
  |> filter(fn: (r) => r._measurement == "weather_station")
  |> filter(fn: (r) =>
    r._field == "Global Irradiance" or
    r._field == "Wind Speed"
  )
  |> aggregateWindow(every: ${aggregateWindow}, fn: max, createEmpty: false)

averageFields = from(bucket: "${bucket}")
  |> range(start: -${timeframe})
  |> filter(fn: (r) => r._measurement == "weather_station")
  |> filter(fn: (r) =>
    r._field == "Air Temperature" or
    r._field == "External Temperature" or
    r._field == "Relative Humidity" or
    r._field == "Wind Direction"
  )
  |> aggregateWindow(every: ${aggregateWindow}, fn: mean, createEmpty: false)

union(tables: [globalMax, averageFields])
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
