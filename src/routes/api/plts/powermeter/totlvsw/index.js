import { queryInfluxDB } from '~/lib/db/influxdb.js';

const token = process.env.TOKEN;
const org = process.env.ORG;
const bucket = process.env.BUCKET;
const url = process.env.URL;

export async function GET({ params }) {
    const { powermeter } = params

    const query = `
    lvsw1 = from(bucket: "${bucket}")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "LVSW1")
        |> filter(fn: (r) => r._field == "Active Power" or r._field == "Reactive Power")
        |> last()

    lvsw2 = from(bucket: "${bucket}")
        |> range(start: -1m)
        |> filter(fn: (r) => r._measurement == "LVSW2")
        |> filter(fn: (r) => r._field == "Active Power" or r._field == "Reactive Power")
        |> last()

    union(tables: [lvsw1, lvsw2])
        |> group(columns: ["_field"])  
        |> sum(column: "_value")
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
