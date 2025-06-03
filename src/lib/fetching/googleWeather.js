import { getWeatherDescription } from '../utils/weatherDesc';

export async function fetchGoogleWeather() {
  const res = await fetch('/api/weather');
  if (!res.ok) throw new Error('Gagal mengambil data cuaca');

  const data = await res.json();

  if (!data.forecastHours) return [];

  // Map data forecast dan tambahkan properti description hasil dari getWeatherDescription
  const enrichedForecast = data.forecastHours.map((forecast) => {
    const type = forecast.weatherCondition?.type;
    const cloudCover = forecast.cloudCover;

    return {
      startTime: forecast.interval.startTime,
      endTime: forecast.interval.endTime,
      temperature: forecast.temperature?.degrees,
      feelsLike: forecast.feelsLikeTemperature?.degrees,
      description: getWeatherDescription(type, cloudCover),
      rawType: type,
      cloudCover,
      humidity: forecast.relativeHumidity,
      windSpeed: forecast.wind?.speed?.value,
      windDirection: forecast.wind?.direction?.cardinal,
      precipitationProbability: forecast.precipitation?.probability?.percent,
      isDaytime: forecast.isDaytime,
    };
  });

  return enrichedForecast;
}
