export default function getIconName(iconId, isDay) {
  const id = Math.floor(iconId / 100);
  const time = isDay ? 'DAY' : 'NIGHT';
  switch (id) {
    case 2:
    case 3:
    case 5: return 'RAIN';
    case 6: return iconId >= 611 ? 'SLEET' : 'SNOW';
    case 7: return iconId === 741 ? 'FOG' : 'WIND';
    case 8:
      return `CLEAR_${time}`;
    case 9: return iconId >= 803 ? 'CLOUDY' : `PARTLY_CLOUDY_${time}`;
    default: return '';
  }
}
