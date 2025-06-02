export async function fetchPltsData() {
    try {
      const [lvsw1Res, lvsw2Res, it1Res, it2Res, wsRes] = await Promise.all([
        fetch("/api/plts/LVSW1"),
        fetch("/api/plts/LVSW2"),
        fetch("/api/plts/IT1"),
        fetch("/api/plts/IT2"),
        fetch("/api/plts/weatherstation"),
      ]);
  
      // Cek apakah semua response berhasil
      if (![lvsw1Res, lvsw2Res, it1Res, it2Res, wsRes].every(res => res.ok)) {
        throw new Error("Failed to fetch one or more data sources");
      }
  
      // Parsing JSON secara paralel
      const [lvsw1Data, lvsw2Data, it1Data, it2Data, wsData] = await Promise.all([
        lvsw1Res.json(),
        lvsw2Res.json(),
        it1Res.json(),
        it2Res.json(),
        wsRes.json(),
      ]);
  
      // Mengembalikan data dalam bentuk objek
      return {
        lvsw1Data,
        lvsw2Data,
        it1Data,
        it2Data,
        wsData,
      };
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }
  
// Promise Banyak dengan Setter dan OnError 
// export async function fetchPltsData(setters, onError) {
//     const { setLvsw1Data, setLvsw2Data, setIt1Data, setIt2Data, setWSData } = setters;

//     try {
//         const [lvsw1Res, lvsw2Res, it1Res, it2Res, wsRes] = await Promise.all([
//             fetch("/api/plts/LVSW1"),
//             fetch("/api/plts/LVSW2"),
//             fetch("/api/plts/IT1"),
//             fetch("/api/plts/IT2"),
//             fetch("/api/plts/weatherstation"),
//         ]);

//         if (![lvsw1Res, lvsw2Res, it1Res, it2Res, wsRes].every((res) => res.ok)) {
//             throw new Error("Failed to fetch data");
//         }

//         setLvsw1Data(await lvsw1Res.json());
//         setLvsw2Data(await lvsw2Res.json());
//         setIt1Data(await it1Res.json());
//         setIt2Data(await it2Res.json());
//         setWSData(await wsRes.json());
//     } catch (err) {
//         onError(err.message);
//     }
// }

// Promise Tunggal
// export async function fetchLvsw1Data() {
//     try {
//       const response = await fetch("/api/plts/LVSW1");
  
//       if (!response.ok) {
//         throw new Error("Failed to fetch LVSW1 data");
//       }
  
//       const data = await response.json();
//       return data; // Mengembalikan data hasil fetch
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   }
  
