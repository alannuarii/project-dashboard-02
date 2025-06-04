export function getWeatherDescription(type, cloudCover) {
    switch (type) {
        case "CLEAR":
        case "MOSTLY_CLEAR":
        case "SUNNY":
            return "Clear";
        case "PARTLY_CLOUDY":
        case "MOSTLY_SUNNY":
            return "Mostly Sunny";
        case "CLOUDY":
            return "Cloudy";
        case "FOG":
        case "HAZE":
            return "Foggy";
        case "RAIN":
        case "RAIN_SHOWERS":
        case "SHOWERS":
        case "DRIZZLE":
            return "Rainy";
        case "THUNDERSTORM":
        case "THUNDERSTORMS":
            return "Thunderstorms";
        case "SNOW":
            return "Snow";
        case "WINDY":
            return "Windy";
        default:
            break;
    }

    if (typeof cloudCover === 'number') {
        if (cloudCover < 0.2) return "Clear";
        if (cloudCover < 0.5) return "Partly Cloudy";
        if (cloudCover < 0.85) return "Mostly Cloudy";
        return "Cloudy";
    }

    return "Unknown";
}
