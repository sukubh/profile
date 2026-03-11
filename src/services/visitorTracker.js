// Visitor Tracking Service
// Collects comprehensive visitor information and stores it locally

const STORAGE_KEY = 'visitor_analytics_data';
const ADMIN_PASSWORD = 'admin123'; // Change this to your preferred password

// Get all stored visitors
export const getVisitors = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading visitor data:', error);
    return [];
  }
};

// Save visitor to storage
const saveVisitor = (visitor) => {
  try {
    const visitors = getVisitors();
    visitors.push(visitor);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visitors));
    return true;
  } catch (error) {
    console.error('Error saving visitor data:', error);
    return false;
  }
};

// Get browser and device information
const getBrowserInfo = () => {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = '';
  
  if (ua.includes('Firefox/')) {
    browserName = 'Firefox';
    browserVersion = ua.split('Firefox/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browserName = 'Chrome';
    browserVersion = ua.split('Chrome/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    browserName = 'Safari';
    browserVersion = ua.split('Version/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Edg/')) {
    browserName = 'Edge';
    browserVersion = ua.split('Edg/')[1]?.split(' ')[0] || '';
  } else if (ua.includes('Opera/') || ua.includes('OPR/')) {
    browserName = 'Opera';
    browserVersion = ua.split('OPR/')[1]?.split(' ')[0] || '';
  }

  return { browserName, browserVersion, userAgent: ua };
};

// Get device information
const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let deviceType = 'Desktop';
  let os = 'Unknown';

  // Detect device type
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    deviceType = 'Mobile';
  }

  // Detect OS
  if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11';
  else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
  else if (ua.includes('Windows NT 6.2')) os = 'Windows 8';
  else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  return {
    deviceType,
    os,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    screenColorDepth: window.screen.colorDepth,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    language: navigator.language || navigator.userLanguage,
    languages: navigator.languages ? [...navigator.languages] : [],
    platform: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    onlineStatus: navigator.onLine,
    hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
    deviceMemory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : 'Unknown',
  };
};

// Get connection information
const getConnectionInfo = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    return {
      effectiveType: connection.effectiveType || 'Unknown',
      downlink: connection.downlink ? `${connection.downlink} Mbps` : 'Unknown',
      rtt: connection.rtt ? `${connection.rtt} ms` : 'Unknown',
      saveData: connection.saveData || false,
    };
  }
  return { effectiveType: 'Unknown', downlink: 'Unknown', rtt: 'Unknown', saveData: false };
};

// Get referrer information
const getReferrerInfo = () => {
  return {
    referrer: document.referrer || 'Direct',
    currentUrl: window.location.href,
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
  };
};

// Get IP and location data from free API
const getIPAndLocation = async () => {
  try {
    // Using ipapi.co - free tier allows 1000 requests/day
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      return {
        ip: data.ip,
        city: data.city,
        region: data.region,
        regionCode: data.region_code,
        country: data.country_name,
        countryCode: data.country_code,
        continent: data.continent_code,
        postal: data.postal,
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        utcOffset: data.utc_offset,
        currency: data.currency,
        isp: data.org,
        asn: data.asn,
        languages: data.languages,
      };
    }
  } catch (error) {
    console.log('Primary IP API failed, trying backup...');
  }

  // Backup API - ipinfo.io
  try {
    const response = await fetch('https://ipinfo.io/json');
    if (response.ok) {
      const data = await response.json();
      const [lat, lon] = (data.loc || ',').split(',');
      return {
        ip: data.ip,
        city: data.city,
        region: data.region,
        country: data.country,
        postal: data.postal,
        latitude: lat,
        longitude: lon,
        timezone: data.timezone,
        isp: data.org,
      };
    }
  } catch (error) {
    console.log('Backup IP API also failed');
  }

  return { ip: 'Unknown', city: 'Unknown', country: 'Unknown' };
};

// Get battery information (if available)
const getBatteryInfo = async () => {
  try {
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();
      return {
        level: `${Math.round(battery.level * 100)}%`,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
      };
    }
  } catch (error) {
    // Battery API not available
  }
  return null;
};

// Generate unique visitor ID
const generateVisitorId = () => {
  return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Check if this is a returning visitor
const checkReturningVisitor = () => {
  const visitorId = localStorage.getItem('unique_visitor_id');
  if (visitorId) {
    return { isReturning: true, visitorId };
  }
  const newId = generateVisitorId();
  localStorage.setItem('unique_visitor_id', newId);
  return { isReturning: false, visitorId: newId };
};

// Main tracking function
export const trackVisitor = async () => {
  const timestamp = new Date().toISOString();
  const { isReturning, visitorId } = checkReturningVisitor();
  
  // Collect all information
  const browserInfo = getBrowserInfo();
  const deviceInfo = getDeviceInfo();
  const connectionInfo = getConnectionInfo();
  const referrerInfo = getReferrerInfo();
  const locationInfo = await getIPAndLocation();
  const batteryInfo = await getBatteryInfo();

  const visitorData = {
    id: generateVisitorId(),
    visitorId: visitorId,
    isReturning: isReturning,
    visitTimestamp: timestamp,
    visitDate: new Date().toLocaleDateString(),
    visitTime: new Date().toLocaleTimeString(),
    
    // Location & IP
    ...locationInfo,
    
    // Browser
    ...browserInfo,
    
    // Device
    ...deviceInfo,
    
    // Connection
    connection: connectionInfo,
    
    // Referrer
    ...referrerInfo,
    
    // Battery (if available)
    battery: batteryInfo,
    
    // Session info
    sessionDuration: 0,
    pageViews: 1,
  };

  // Save to localStorage
  saveVisitor(visitorData);
  
  console.log('Visitor tracked:', visitorData);
  return visitorData;
};

// Clear all visitor data (admin function)
export const clearAllVisitors = (password) => {
  if (password === ADMIN_PASSWORD) {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  }
  return false;
};

// Export visitor data as JSON
export const exportVisitorData = () => {
  const visitors = getVisitors();
  const dataStr = JSON.stringify(visitors, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `visitor_analytics_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Get analytics summary
export const getAnalyticsSummary = () => {
  const visitors = getVisitors();
  
  if (visitors.length === 0) {
    return {
      totalVisits: 0,
      uniqueVisitors: 0,
      returningVisitors: 0,
      newVisitors: 0,
      countries: {},
      cities: {},
      browsers: {},
      devices: {},
      operatingSystems: {},
      topReferrers: {},
    };
  }

  const uniqueIds = new Set(visitors.map(v => v.visitorId));
  const countries = {};
  const cities = {};
  const browsers = {};
  const devices = {};
  const operatingSystems = {};
  const referrers = {};

  visitors.forEach(v => {
    // Countries
    if (v.country) {
      countries[v.country] = (countries[v.country] || 0) + 1;
    }
    
    // Cities
    if (v.city) {
      cities[v.city] = (cities[v.city] || 0) + 1;
    }
    
    // Browsers
    if (v.browserName) {
      browsers[v.browserName] = (browsers[v.browserName] || 0) + 1;
    }
    
    // Devices
    if (v.deviceType) {
      devices[v.deviceType] = (devices[v.deviceType] || 0) + 1;
    }
    
    // OS
    if (v.os) {
      operatingSystems[v.os] = (operatingSystems[v.os] || 0) + 1;
    }
    
    // Referrers
    const ref = v.referrer || 'Direct';
    referrers[ref] = (referrers[ref] || 0) + 1;
  });

  return {
    totalVisits: visitors.length,
    uniqueVisitors: uniqueIds.size,
    returningVisitors: visitors.filter(v => v.isReturning).length,
    newVisitors: visitors.filter(v => !v.isReturning).length,
    countries,
    cities,
    browsers,
    devices,
    operatingSystems,
    topReferrers: referrers,
  };
};

// Verify admin password
export const verifyAdminPassword = (password) => {
  return password === ADMIN_PASSWORD;
};
