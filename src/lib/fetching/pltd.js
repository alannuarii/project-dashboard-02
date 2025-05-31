export async function fetchPltdData(setters, onError) {
    const { setDg1Data, setDg6Data, setDg7Data, setDg8Data, setDg9Data } = setters;

    try {
        const [dg1Res, dg6Res, dg7Res, dg8Res, dg9Res] = await Promise.all([
            fetch("/api/dg1"),
            fetch("/api/dg6"),
            fetch("/api/dg7"),
            fetch("/api/dg8"),
            fetch("/api/dg9"),
        ]);

        if (![dg1Res, dg6Res, dg7Res, dg8Res, dg9Res].every((res) => res.ok)) {
            throw new Error("Failed to fetch data");
        }

        setDg1Data(await dg1Res.json());
        setDg6Data(await dg6Res.json());
        setDg7Data(await dg7Res.json());
        setDg8Data(await dg8Res.json());
        setDg9Data(await dg9Res.json());
    } catch (err) {
        onError(err.message);
    }
}
