import dotenv from 'dotenv';
dotenv.config();

import { queryInfluxDB } from '../../../lib/db/influxdb.js';

const token = process.env.TOKEN;
const org = process.env.ORG;
const bucket = process.env.BUCKET;
const url = process.env.URL;

const query = `
from(bucket: "${bucket}")
  |> range(start: -1m)
  |> filter(fn: (r) => r._measurement == "PM-DG6")
  |> filter(fn: (r) => 
    r._field == "Current L1" or 
    r._field == "Current L2" or 
    r._field == "Current L3" or 
    r._field == "Voltage L1 L2" or 
    r._field == "Voltage L2 L3" or 
    r._field == "Voltage L3 L1" or 
    r._field == "Frequency" or 
    r._field == "Power Factor" or 
    r._field == "Active Power" or 
    r._field == "Reactive Power"
  )
  |> last()
`;

export async function GET() {
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
