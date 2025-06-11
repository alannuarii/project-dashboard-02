// export async function fetchPltdData(setters, onError) {
//     const { setDg1Data, setDg6Data, setDg7Data, setDg8Data, setDg9Data } = setters;

//     try {
//         const [dg1Res, dg6Res, dg7Res, dg8Res, dg9Res] = await Promise.all([
//             fetch("/api/pltd/1"),
//             fetch("/api/pltd/6"),
//             fetch("/api/pltd/7"),
//             fetch("/api/pltd/8"),
//             fetch("/api/pltd/9"),
//         ]);

//         if (![dg1Res, dg6Res, dg7Res, dg8Res, dg9Res].every((res) => res.ok)) {
//             throw new Error("Failed to fetch data");
//         }

//         setDg1Data(await dg1Res.json());
//         setDg6Data(await dg6Res.json());
//         setDg7Data(await dg7Res.json());
//         setDg8Data(await dg8Res.json());
//         setDg9Data(await dg9Res.json());
//     } catch (err) {
//         onError(err.message);
//     }Z
// }

export async function fetchPltdData() {
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

        // Parsing JSON secara paralel
        const [dg1Data, dg6Data, dg7Data, dg8Data, dg9Data] = await Promise.all([
            dg1Res.json(),
            dg6Res.json(),
            dg7Res.json(),
            dg8Res.json(),
            dg9Res.json(),
        ]);

        // Mengembalikan data dalam bentuk objek
        return {
            dg1Data,
            dg6Data,
            dg7Data,
            dg8Data,
            dg9Data,
        };
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}
