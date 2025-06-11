export async function GET() {
  const apiKey = process.env.WEATHER_API_KEY;
  const latitude = 3.617790964635497;
  const longitude = 125.46711232936215;

  // Ambil data 48 jam dari waktu saat ini untuk memastikan prakiraan esok hari lengkap tersedia
  const hoursToFetch = 48;

  // URL endpoint Google Weather API
  const url =
    "https://weather.googleapis.com/v1/forecast/hours:lookup" +
    `?location.latitude=${latitude}` +
    `&location.longitude=${longitude}` +
    `&hours=${hoursToFetch}` +
    `&key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Gagal mengambil data: ${response.statusText}` }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();

    // Hitung waktu UTC untuk tanggal esok hari mulai dan akhir
    const now = new Date();
    const tomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    const dayAfterTomorrow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 2));

    // Filter data supaya hanya jam yang ada di tanggal esok hari (antara tomorrow 00:00:00 - dayAfterTomorrow 00:00:00 UTC)
    // Misalkan data.hourly adalah array jam per jam dengan property startTime (string ISO)
    const filteredHours = (data.hourly || []).filter(function (hourEntry) {
      const entryTime = new Date(hourEntry.startTime);
      return entryTime >= tomorrow && entryTime < dayAfterTomorrow;
    });

    // Buat objek hasil dengan hanya jam yang sudah difilter dari esok hari
    const filteredData = Object.assign({}, data, { hourly: filteredHours });

    return new Response(JSON.stringify(filteredData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan saat mengambil data cuaca." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
