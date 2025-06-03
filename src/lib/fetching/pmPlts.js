export async function fetchPMData(powermeter) {
    try {
      const response = await fetch(`/api/plts/${powermeter}`);
  
      if (!response.ok) {
        throw new Error("Failed to fetch Weather Station data");
      }
  
      const data = await response.json();
      return data; // Mengembalikan data hasil fetch
    } catch (error) {
      throw new Error(error.message);
    }
  }