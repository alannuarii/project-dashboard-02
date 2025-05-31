export async function fetchUnitData(unit, setData, onError) {
    try {
        const response = await fetch(`/api/pltd/${unit}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch data for unit ${unit}`);
        }

        const data = await response.json();
        setData(data);
    } catch (err) {
        onError(err.message);
    }
}
