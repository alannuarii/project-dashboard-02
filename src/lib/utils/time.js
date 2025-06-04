export function convertToWITA(utcTimeStr) {
    const date = new Date(utcTimeStr);

    // Tambah 8 jam ke waktu UTC (WITA = UTC+8)
    const witaTime = new Date(date.getTime() + 0 * 60 * 60 * 1000);

    const hours = witaTime.getHours().toString().padStart(2, '0');
    const minutes = witaTime.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes} WITA`;
}
