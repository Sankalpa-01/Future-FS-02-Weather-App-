import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Thunderstorm from '../assets/Thunderstorm.gif';
import Rain from '../assets/Rain.gif';
import SnowDay from '../assets/Snow.gif';
import ClearDay from '../assets/ClearDay.gif';
import ClearNight from '../assets/ClearNight.gif';
import CloudsDay from '../assets/CloudsDay.gif';
import CloudsNight from '../assets/CloudsNight.gif';
import Haze from '../assets/Haze.gif';
import video from '../assets/video1.mp4';

const WeatherBackground = ({ condition }) => {
  const gifs = {
    Thunderstorm,
    Drizzle: Rain,
    Rain,
    Snow: SnowDay,
    Clear: { day: ClearDay, night: ClearNight },
    Clouds: { day: CloudsDay, night: CloudsNight },
    Mist: Haze,
    Smoke: Haze,
    Haze,
    Fog: Haze,
    default: video
  };

  const getBackground = () => {
    if (!condition) return gifs.default;
    const weatherType = condition.main;
    const asset = gifs[weatherType];
    if (!asset) return gifs.default;
    if (typeof asset === 'object') return condition.isDay ? asset.day : asset.night;
    return asset;
  };

  const background = getBackground();

  return (
    <div className='fixed inset-0 z-0 overflow-hidden'>
      <AnimatePresence mode='wait'>
        {background === video ? (
          <motion.video
            key='video'
            autoPlay
            loop
            muted
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className='w-full h-full object-cover pointer-events-none'
          >
            <source src={video} type='video/mp4' />
          </motion.video>
        ) : (
          <motion.img
            key={background}
            src={background}
            alt='Weather-bg'
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className='w-full h-full object-cover pointer-events-none'
          />
        )}
      </AnimatePresence>

      {/* Overlay for contrast */}
      <div className='absolute inset-0 bg-black/40' />
    </div>
  );
};

export default WeatherBackground;
