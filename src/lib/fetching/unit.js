export async function fetchUnitData(unit, setData, onError) {
    try {
        const response = await fetch(`/api/dg${unit}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch data for unit ${unit}`);
        }

        const data = await response.json();
        setData(data);
    } catch (err) {
        onError(err.message);
    }
}
