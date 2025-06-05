export async function fetchBssData(bss) {
    try {
      const response = await fetch(`/api/plts/bss/${bss}`);
  
      if (!response.ok) {
        throw new Error("Failed to fetch BSS data");
      }
  
      const data = await response.json();
      return data; // Mengembalikan data hasil fetch
    } catch (error) {
      throw new Error(error.message);
    }
  }