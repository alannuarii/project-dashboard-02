import pool from '../../../../../lib/db/mariadb.js';

async function getBms(bss) {
  let query = '';
  const values = [];

  if (bss === 'bss1') {
    query = `
      SELECT b.* 
      FROM battery AS b 
      INNER JOIN (
        SELECT id_bms, MAX(waktu) AS latest_waktu 
        FROM battery 
        WHERE id_bms < 89 
        GROUP BY id_bms
      ) AS latest 
      ON b.id_bms = latest.id_bms AND b.waktu = latest.latest_waktu 
      ORDER BY b.id_bms ASC
    `;
  } else if (bss === 'bss2') {
    query = `
      SELECT b.* 
      FROM battery AS b 
      INNER JOIN (
        SELECT id_bms, MAX(waktu) AS latest_waktu 
        FROM battery 
        WHERE id_bms > 88 
        GROUP BY id_bms
      ) AS latest 
      ON b.id_bms = latest.id_bms AND b.waktu = latest.latest_waktu 
      ORDER BY b.id_bms ASC
    `;
  } else {
    return [];
  }

  try {
    const [rows] = await pool.query(query, values);
    return rows;
  } catch (err) {
    console.error('Database error:', err);
    return [];
  }
}

export async function GET({ params }) {
  // console.log(params)
  const bss = params.bss;
  const result = await getBms(bss);

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}
