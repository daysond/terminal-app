import React, { useState, useEffect } from 'react';

const Countdown = ({ futureDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(futureDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const countdownTimer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearTimeout(countdownTimer);
    };
  });

  return (
    <div className='countdown-clock'>
      <p>
        {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days}:
        {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours}:
        {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}:
        {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
      </p>
    </div>
  );
};

export default Countdown;
