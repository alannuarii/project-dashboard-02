import { getWeatherDescription } from "~/lib/utils/weatherDesc";

const weatherImageMap = {
  "Clear": "sun.png",
  "Mostly Sunny": "cloud-sun.png",
  "Partly Cloudy": "cloud.png",
  "Cloudy": "clouds.png",
  "Rainy": "cloud-rain.png",
  "Thunderstorms": "thunderstorm.png",
  "Foggy": "fog.png",
  "Snow": "snowflake.png",
  "Windy": "wind.png",
  "Unknown": "tidak-diketahui.png",
};

export default function WeatherIcon(props) {
  const description = getWeatherDescription(props.data?.rawType, props.data?.cloudCover);
  const imageName = weatherImageMap[description] || "tidak-diketahui.png";

  return <img src={`/img/weathers/${imageName}`} alt={description} title={description} width={64} height={64} />;
}
