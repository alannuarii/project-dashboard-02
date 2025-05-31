export async function fetchChartData(unit, timeframe, setData, onError) {
  try {
    const response = await fetch(`/api/pltd/${unit}/${timeframe}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for unit ${unit}`);
    }

    const data = await response.json();
    setData(data);
  } catch (err) {
    onError(err.message);
  }
}
