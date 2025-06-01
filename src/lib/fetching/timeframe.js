export const fetchTimeframeData = async (unit, timeframe) => {
  try {
    const response = await fetch(`/api/pltd/${unit}/${timeframe}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      error: null
    };
  } catch (error) {
    console.error('Error fetching timeframe data:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to fetch data'
    };
  }
};