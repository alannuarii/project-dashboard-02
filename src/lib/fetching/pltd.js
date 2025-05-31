export async function fetchPltdData(setters, onError) {
    const { setDg1Data, setDg6Data, setDg7Data, setDg8Data, setDg9Data } = setters;

    try {
        const [dg1Res, dg6Res, dg7Res, dg8Res, dg9Res] = await Promise.all([
            fetch("/api/pltd/1"),
            fetch("/api/pltd/6"),
            fetch("/api/pltd/7"),
            fetch("/api/pltd/8"),
            fetch("/api/pltd/9"),
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
