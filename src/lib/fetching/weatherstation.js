export async function fetchWSData() {
  try {
    const response = await fetch("/api/plts/weatherstation");

    if (!response.ok) {
      throw new Error("Failed to fetch Weather Station data");
    }

    const data = await response.json();
    return data; // Mengembalikan data hasil fetch
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function fetchWSTimeframeData(timeframe) {
  try {
    const response = await fetch(`/api/plts/weatherstation/${timeframe}`);

    if (!response.ok) {
      throw new Error("Failed to fetch Weather Station data");
    }

    const data = await response.json();
    return data; // Mengembalikan data hasil fetch
  } catch (error) {
    throw new Error(error.message);
  }
}