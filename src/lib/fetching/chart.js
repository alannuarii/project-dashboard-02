export async function fetchChartData(unit, interval, setData, onError) {
  try {
    const response = await fetch(`/api/chart?unit=${unit}&interval=${interval}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch data for unit ${unit}: ${response.statusText}`);
    }

    const data = await response.json();
    setData(data);
  } catch (err) {
    onError(err.message);
  }
}
