import React, { useState, useEffect } from 'react';

const WorldClock = () => {
  const [time, setTime] = useState(new Date());
  
  // List of major cities with their time zones
  const cities = [
    { name: 'New York', timeZone: 'America/New_York' },
    { name: 'London', timeZone: 'Europe/London' },
    { name: 'Tokyo', timeZone: 'Asia/Tokyo' },
    { name: 'Sydney', timeZone: 'Australia/Sydney' },
    { name: 'Paris', timeZone: 'Europe/Paris' },
    { name: 'Dubai', timeZone: 'Asia/Dubai' },
    { name: 'Los Angeles', timeZone: 'America/Los_Angeles' },
    { name: 'Singapore', timeZone: 'Asia/Singapore' }
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Clean up the interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Format time for a specific time zone
  const formatTimeForTimeZone = (timeZone) => {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }).format(time);
  };

  return (
    <div className="world-clock">
      <h2>World Clock</h2>
      <div className="clock-grid">
        {cities.map((city) => (
          <div key={city.name} className="clock-item">
            <h3>{city.name}</h3>
            <div className="clock-time">{formatTimeForTimeZone(city.timeZone)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorldClock;