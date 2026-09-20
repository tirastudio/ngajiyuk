import { City, PrayerTimes } from '../types/quran';

// Helper trigonometric functions in degrees
const dSin = (d: number) => Math.sin((d * Math.PI) / 180);
const dCos = (d: number) => Math.cos((d * Math.PI) / 180);
const dTan = (d: number) => Math.tan((d * Math.PI) / 180);
const dAsin = (x: number) => (Math.asin(x) * 180) / Math.PI;
const dAcos = (x: number) => (Math.acos(x) * 180) / Math.PI;
const dAtan2 = (y: number, x: number) => (Math.atan2(y, x) * 180) / Math.PI;

function padZero(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatMinutesToTime(totalMinutes: number): string {
  let m = Math.round(totalMinutes);
  if (m < 0) m += 24 * 60;
  if (m >= 24 * 60) m %= 24 * 60;
  const hours = Math.floor(m / 60);
  const mins = m % 60;
  return `${padZero(hours)}:${padZero(mins)}`;
}

/**
 * Standard Kemenag RI Prayer Calculation Formula
 * Subuh angle: -20°
 * Isya angle: -18°
 * Asr: Shafi'i (shadow length factor = 1)
 * Ihtiyath (safety buffer): +2 minutes
 * Imsak: 10 minutes prior to Subuh
 */
export function calculateKemenagPrayerTimes(city: City, date: Date = new Date()): PrayerTimes {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Timezone offset in hours
  let tzOffset = 7; // WIB
  if (city.timezone === 'WITA') tzOffset = 8;
  if (city.timezone === 'WIT') tzOffset = 9;

  // Approximate Sun equation
  const B = (360 / 365) * (dayOfYear - 81);
  const EoT = 9.87 * dSin(2 * B) - 7.53 * dCos(B) - 1.5 * dSin(B); // Equation of Time in minutes
  const declination = 23.45 * dSin((360 / 365) * (dayOfYear - 81)); // Solar declination in degrees

  const lat = city.latitude;
  const lng = city.longitude;

  // Transit (solar noon) in local time
  const solarNoonMinutes = 12 * 60 - EoT - (lng - tzOffset * 15) * 4;

  // Dzuhur: Solar noon + 2 min ihtiyath
  const dzuhurMin = solarNoonMinutes + 2;

  // Helper for sun altitude angle T (in minutes from solar noon)
  const calcHourAngleMinutes = (angleDeg: number): number | null => {
    const cosHA = (dSin(angleDeg) - dSin(lat) * dSin(declination)) / (dCos(lat) * dCos(declination));
    if (cosHA > 1 || cosHA < -1) return null; // Sun doesn't reach that angle
    const haDeg = dAcos(cosHA);
    return haDeg * 4; // 1 degree = 4 minutes
  };

  // Subuh: Sun altitude = -20 degrees (Kemenag standard)
  const subuhHA = calcHourAngleMinutes(-20) || 75 * 4;
  const subuhMin = solarNoonMinutes - subuhHA + 2;

  // Imsak: 10 minutes before Subuh
  const imsakMin = subuhMin - 10;

  // Sunrise (Terbit): -0.833 degrees
  const sunriseHA = calcHourAngleMinutes(-0.833) || 90 * 4;
  const sunriseMin = solarNoonMinutes - sunriseHA - 2;

  // Dhuha: Sun altitude approx +4.5 degrees
  const dhuhaHA = calcHourAngleMinutes(4.5) || 82 * 4;
  const dhuhaMin = solarNoonMinutes - dhuhaHA + 2;

  // Asr: shadow = length + shadow_at_noon
  const noonZenith = Math.abs(lat - declination);
  const asrAlt = (180 / Math.PI) * Math.atan(1 / (1 + dTan(noonZenith)));
  const asrHA = calcHourAngleMinutes(asrAlt) || 55 * 4;
  const asrMin = solarNoonMinutes + asrHA + 2;

  // Maghrib: Sun altitude = -0.833 degrees
  const maghribMin = solarNoonMinutes + sunriseHA + 2;

  // Isya: Sun altitude = -18 degrees (Kemenag standard)
  const isyaHA = calcHourAngleMinutes(-18) || 72 * 4;
  const isyaMin = solarNoonMinutes + isyaHA + 2;

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  const dayName = days[date.getDay()];
  const dateFormatted = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

  return {
    date: dateFormatted,
    dayName,
    imsak: formatMinutesToTime(imsakMin),
    subuh: formatMinutesToTime(subuhMin),
    terbit: formatMinutesToTime(sunriseMin),
    dhuha: formatMinutesToTime(dhuhaMin),
    dzuhur: formatMinutesToTime(dzuhurMin),
    ashar: formatMinutesToTime(asrMin),
    maghrib: formatMinutesToTime(maghribMin),
    isya: formatMinutesToTime(isyaMin),
  };
}

/**
 * Generate 7 days schedule for the given city
 */
export function getWeeklyPrayerSchedule(city: City, startDate: Date = new Date()): PrayerTimes[] {
  const schedule: PrayerTimes[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    schedule.push(calculateKemenagPrayerTimes(city, d));
  }
  return schedule;
}

export interface NextPrayerInfo {
  name: string;
  time: string;
  remainingSeconds: number;
  formattedRemaining: string;
}

export function getNextPrayer(prayerTimes: PrayerTimes, now: Date = new Date()): NextPrayerInfo {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentSeconds = now.getSeconds();
  const currentTotalSec = currentMinutes * 60 + currentSeconds;

  const parseToSec = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h * 60 + m) * 60;
  };

  const prayers = [
    { name: 'Subuh', sec: parseToSec(prayerTimes.subuh) },
    { name: 'Terbit', sec: parseToSec(prayerTimes.terbit) },
    { name: 'Dzuhur', sec: parseToSec(prayerTimes.dzuhur) },
    { name: 'Ashar', sec: parseToSec(prayerTimes.ashar) },
    { name: 'Maghrib', sec: parseToSec(prayerTimes.maghrib) },
    { name: 'Isya', sec: parseToSec(prayerTimes.isya) },
  ];

  for (const p of prayers) {
    if (p.sec > currentTotalSec) {
      const diff = p.sec - currentTotalSec;
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      return {
        name: p.name,
        time: formatMinutesToTime(p.sec / 60),
        remainingSeconds: diff,
        formattedRemaining: `${padZero(h)}:${padZero(m)}:${padZero(s)}`,
      };
    }
  }

  // If past Isya, next is tomorrow's Subuh
  const tomorrowSubuhSec = parseToSec(prayerTimes.subuh) + 24 * 3600;
  const diff = tomorrowSubuhSec - currentTotalSec;
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;

  return {
    name: 'Subuh Esok',
    time: prayerTimes.subuh,
    remainingSeconds: diff,
    formattedRemaining: `${padZero(h)}:${padZero(m)}:${padZero(s)}`,
  };
}
