export async function GET() {
  const apiKey = process.env.WEATHER_API_KEY;
  const latitude = 3.617790964635497;
  const longitude = 125.46711232936215;
  const hours = 3;

  const url = `https://weather.googleapis.com/v1/forecast/hours:lookup` +
    `?location.latitude=${latitude}` +
    `&location.longitude=${longitude}` +
    `&hours=${hours}` +
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

    // Kirim data mentah apa adanya ke client
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return new Response(
      JSON.stringify({ error: "Terjadi kesalahan saat mengambil data cuaca." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
