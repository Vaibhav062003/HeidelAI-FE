'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TimeUnit = ({ value, label }: { value: number; label?: string }) => {
  const formattedValue = value.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center mx-0.5">
      <div className="relative h-6 w-5 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={formattedValue}
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center font-mono font-bold"
          >
            {formattedValue}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

const Separator = () => (
  <span className=" font-mono font-bold">:</span>
);

const CountDownTimer = ({ targetDate }: { targetDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="flex items-center h-6 text-sm font-medium">
            <span className="mr-0.5 font-semibold ">🚀 Beta live in - </span>
            <div className="flex items-center">
                <TimeUnit value={timeLeft.days} />
                <Separator />
                <TimeUnit value={timeLeft.hours} />
                <Separator />
                <TimeUnit value={timeLeft.minutes} />
                <Separator />
                <TimeUnit value={timeLeft.seconds} />
</div>
</div>
)
}

export default CountDownTimer;