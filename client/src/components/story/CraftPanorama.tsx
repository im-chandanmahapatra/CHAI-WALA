import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Flame, Droplets, ShieldCheck } from 'lucide-react';

export const CraftPanorama: React.FC = () => {
  const craftSteps = [
    {
      num: '01',
      title: 'Assam CTC & Bruised Ginger',
      desc: 'Raw rhizomes crushed fresh in heavy stone mortars for every single decoction batch. Whole green cardamom cracked to order.',
      metric: 'Crushed to Order',
      icon: <Sparkles className="w-4 h-4 text-[var(--primary)]" />,
    },
    {
      num: '02',
      title: 'Slow Simmer & Rolling Boil',
      desc: 'Steeped slow in traditional brass pots until the tea tannins, rich milk fats, and spices caramelize together into deep amber.',
      metric: '3-Stage Rolling Boil',
      icon: <Flame className="w-4 h-4 text-[var(--primary)]" />,
    },
    {
      num: '03',
      title: 'Double-Pulled Aeration',
      desc: 'Pulled high from pot to jug to introduce natural micro-foam and velvety mouthfeel without electric steam wands.',
      metric: 'Hand-Aerated',
      icon: <Droplets className="w-4 h-4 text-[var(--primary)]" />,
    },
    {
      num: '04',
      title: 'Terracotta & Fresh Baking',
      desc: 'Poured steaming into unglazed porous clay kulhads that impart a subtle mineral petrichor finish. Buns toasted with salted Amul butter.',
      metric: 'Natural Kulhad',
      icon: <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />,
    },
  ];

  return (
    <section id="craft-ritual" className="py-20 bg-[var(--bg)] border-b border-[var(--border)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--primary)] block">
            Our Brewing Ritual
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[var(--ink)]">
            No Sachets. No Powder. No Shortcuts.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink-muted)] leading-relaxed font-body">
            The secret to an honest cup is simple: real spices, slow patience, and calibrated heat in traditional vessels.
          </p>
        </div>

        {/* 4-Column Craft Process */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {craftSteps.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.1, ease: 'easeOut' }}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 relative shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-black text-2xl text-[var(--primary)]/40 font-tabular">
                    {step.num}
                  </span>
                  <div className="p-2 rounded-xl bg-[var(--surface-subtle)] border border-[var(--border)] shadow-stamp">
                    {step.icon}
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] block mb-1">
                  {step.metric}
                </span>

                <h4 className="font-display font-bold text-base text-[var(--ink)] leading-snug mb-2">
                  {step.title}
                </h4>

                <p className="text-xs text-[var(--ink-muted)] leading-relaxed font-body">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] mt-5 flex items-center gap-1.5 text-[11px] text-[var(--primary)] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Brewed with devotion</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CraftPanorama;
