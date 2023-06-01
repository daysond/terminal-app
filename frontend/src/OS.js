

export function getOperatingSystem(window) {
    const userAgent = window.navigator.userAgent;
    let newOS = 'Unknown';

    if (userAgent.indexOf('Win') !== -1) {
      newOS = 'Windows';
    } else if (userAgent.indexOf('Mac') !== -1) {
      newOS = 'Mac';
    } else if (userAgent.indexOf('Linux') !== -1) {
      newOS = 'Linux';
    } else if (userAgent.indexOf('Android') !== -1) {
      newOS = 'Android';
    } else if (userAgent.indexOf('iOS') !== -1) {
      newOS = 'iOS';
    }

    return newOS

  }
  
export function getTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return `${hours}:${minutes}:${seconds}`
}