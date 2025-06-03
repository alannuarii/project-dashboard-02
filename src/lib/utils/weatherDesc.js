export function getWeatherDescription(type, cloudCover) {
    switch (type) {
        case "CLEAR":
        case "MOSTLY_CLEAR":
        case "SUNNY":
            return "Cerah";
        case "PARTLY_CLOUDY":
        case "MOSTLY_SUNNY":
            return "Cerah Berawan";
        case "CLOUDY":
            return "Mendung";
        case "FOG":
        case "HAZE":
            return "Berkabut";
        case "RAIN":
        case "RAIN_SHOWERS":
        case "SHOWERS":
        case "DRIZZLE":
            return "Hujan";
        case "THUNDERSTORM":
        case "THUNDERSTORMS":
            return "Hujan Petir";
        case "SNOW":
            return "Salju";
        case "WINDY":
            return "Berangin";
        default:
            break;
    }

    if (typeof cloudCover === 'number') {
        if (cloudCover < 0.2) return "Cerah";
        if (cloudCover < 0.5) return "Cerah Berawan";
        if (cloudCover < 0.85) return "Berawan";
        return "Mendung";
    }

    return "Tidak Diketahui";
}
