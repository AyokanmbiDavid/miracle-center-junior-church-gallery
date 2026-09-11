import React from 'react';
import { Church, CaretRight, GraduationCap } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import churchImg from '../../../images/church.png';
import toddlersImg from '../../../images/toddlers.png';
import teenagersImg from '../../../images/teenagers.png';
import childrenImg from '../../../images/Children.jpg';

const classes = [
  { id: 1, label: 'Toddlers', ages: '0-5 yrs', img: toddlersImg },
  { id: 2, label: 'Children', ages: '6-8 yrs', img: toddlersImg },
  { id: 3, label: 'Pre-teens', ages: '9-12 yrs', img: childrenImg },
  { id: 4, label: 'Teenagers', ages: '13-19 yrs', img: teenagersImg },
];

export default function General() {
  return (
    <div className="p-6 max-w-7xl mx-auto bg-stone-50 dark:bg-zinc-950 min-h-screen text-stone-800 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* Supabase Church Hero Welcome Banner */}
      <div className="w-full relative h-52 flex rounded-xl border border-stone-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs mb-8">
        <div className="flex z-10 pl-6 flex-col w-1/2 justify-center gap-1.5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 dark:text-amber-500 flex items-center gap-1.5">
            <Church size={14} weight="duotone" /> Welcome to Sanctuary
          </span>
          <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white uppercase">
            Junior Church
          </h1>
          <p className="text-xs text-stone-500 dark:text-zinc-400 font-medium max-w-xs mt-1">
            Nurturing young hearts in faith, historical truth, and spiritual growth.
          </p>
        </div>

        {/* Adaptive Dynamic Fade Mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-zinc-900 dark:via-zinc-900/80 z-5 pointer-events-none" />

        <div className="w-1/2 ml-auto h-full">
          <img src={churchImg} alt="Sanctuary Visual" className="h-full w-full object-cover" />
        </div>
      </div>

      {/* Department Section Title */}
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-400 dark:text-zinc-500">
          Ministry Departments
        </h2>
        <p className="text-sm font-bold text-stone-900 dark:text-white">Our Active Cohorts</p>
      </div>

      {/* Unified Roster Grid with Throwback Style Absolute Overlays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {classes.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-zinc-900 border border-stone-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-amber-300 dark:hover:border-amber-500 relative group transition-all h-60 shadow-xs"
          >
            {/* Viewport Asset Image Frame */}
            <div className="relative w-full h-full bg-stone-100 dark:bg-zinc-950 overflow-hidden">
              <img
                src={item.img}
                alt={item.label}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
            </div>

            {/* SIGNATURE THROWBACK DESIGN: Absolute positioned overlay cards bottom container */}
            <div className="p-4 flex flex-col absolute w-full bottom-0 gap-2 bg-gradient-to-t from-stone-950 via-stone-950/85 to-transparent border-t border-stone-900/10 backdrop-blur-xs">
              <div className="flex w-full items-center justify-between gap-3">
                <div className="flex flex-col min-w-0">
                  <h3 className="text-sm font-bold text-stone-100 tracking-tight">{item.label}</h3>
                  <p className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                    <GraduationCap size={12} /> {item.ages}
                  </p>
                </div>

                {/* Supabase Styled Direct Navigation Button Action Controls */}
                <Link
                  to={`/classes/${item.id}`}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-mono font-bold bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 rounded-md transition-all shadow-xs active:scale-95"
                  title={`View ${item.label} Roster`}
                >
                  <span>ENTER</span>
                  <CaretRight size={12} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
