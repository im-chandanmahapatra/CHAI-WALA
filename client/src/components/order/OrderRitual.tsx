import React from 'react';

const STEPS = [
  {
    name: 'Choose your favourites',
    text: 'Browse the era menus or the full catalogue. Your bag stays with you as you switch between eras.',
  },
  {
    name: 'Make it yours',
    text: "Pick a cup size and sweetness. Every option's price is shown upfront, and the total updates as you choose.",
  },
  {
    name: 'Collect at the counter',
    text: 'Choose a 15-minute pickup window, then pay by cash or UPI when you collect your fresh cup.',
  },
];

export const OrderRitual: React.FC = () => (
  <section id="ritual" className="order-ritual-editorial-section" aria-labelledby="ritual-editorial-title">
    <header className="section-head" data-reveal>
      <p className="section-number">
        <span>No. 04</span> The ritual
      </p>
      <h2 id="ritual-editorial-title" className="ritual-heading">
        Three steps to <em>your cup.</em>
      </h2>
    </header>

    <ol className="ritual-steps-three-col">
      {STEPS.map((step, i) => (
        <li className="ritual-step-unit" key={step.name} data-reveal>
          <span className="ritual-step-number" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="ritual-step-name">{step.name}</h3>
          <p className="ritual-step-explanation">{step.text}</p>
        </li>
      ))}
    </ol>
  </section>
);
