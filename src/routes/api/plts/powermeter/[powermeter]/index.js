import dotenv from 'dotenv';
dotenv.config();

import { queryInfluxDB } from '../../../../../lib/db/influxdb.js';

const token = process.env.TOKEN;
const org = process.env.ORG;
const bucket = process.env.BUCKET;
const url = process.env.URL;

export async function GET({ params }) {
  const { powermeter } = params

  const query = `
from(bucket: "${bucket}")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "${powermeter}")
  |> filter(fn: (r) => 
    r._field == "Active Power" or 
    r._field == "Reactive Power" or 
    r._field == "Voltage" or 
    r._field == "Current" or 
    r._field == "Power Factor" or 
    r._field == "Frequency"
    )
  |> last()
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
