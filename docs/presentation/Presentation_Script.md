# Chaiwala — Presentation Speaking Script

> **Tone & Delivery Guide:**  
> Speak in clear, calm, natural English. You are a student presenting your MCA mini project. Do not rush. Smile, make eye contact with your evaluators, and use the gesture cues (`[👉 Point to...]`) to connect your words with what is displayed on the screen.

---

## Slide 1 — Project Identity (Cover Slide)

**Target Time:** 35–45 seconds  
**Visual Focus:** Left-hand title block and right-hand live hero viewport.

### What to Say:
"Good morning, respected professors and evaluators.

My name is **[STUDENT NAME] (Chandan Mahapatra)**, and I am pursuing my MCA at **Srusti Academy of Management and Technology**. Today, I am proud to present my mini project: **Chaiwala — Chai Across Generations**.

[👉 *Point to the right side of the screen showing the 1900s Adda hero section*]

Our core brand motto is *'Waqt badla. Baithak wahi'*, which means 'Time changes, but the gathering remains.' 

Chaiwala is a QR-first web application designed for tea counters and cafés. It blends the nostalgic warmth of traditional Indian 'Adda' culture with the speed and convenience of modern digital ordering. Instead of forcing customers to stand in crowded queues, Chaiwala allows them to scan a table QR code, explore two distinct generational eras, customize their beverage, and choose a scheduled pickup time.

Let me now explain the real-world problem this project solves."

### Transition to Slide 2:
*"Moving to the next slide, let us look at the core problem and how our four pillars address it."*

---

## Slide 2 — Problem, Solution and Project Overview

**Target Time:** 40–45 seconds  
**Visual Focus:** Problem bullets on the left, customization modal and ticket on the right.

### What to Say:
"During morning and evening tea breaks, local tea stalls and campus counters face severe rush-hour congestion. Customers are forced to wait blindly in noisy, disorganized queues. At the same time, standard delivery apps feel very cold and commercial—they completely remove the friendly, social experience of having tea with friends.

To solve this, Chaiwala introduces four key pillars:

[👉 *Point to the Customization Modal screenshot at top right*]
1. **Dual-Era Experience:** Customers can toggle between two curated worlds: a nostalgic **1900s Adda** with brass aesthetics, classic cutting chai, and vintage radio; and a modern **2020s Café** with matcha, boba tea, and iced drinks.
2. **Tactile Customization:** As you can see in this modal, customers can easily adjust sugar levels, choose between a glass cutting or an earthen kulhad mug, and add extra spices. All price changes update immediately.

[👉 *Point to the Digital Order Ticket screenshot at bottom right*]
3. **15-Minute Pickup Slots:** To prevent counter overcrowding, orders are booked into 15-minute time windows with a strict limit of six orders per slot.
4. **Digital Ticket Fulfillment:** Once an order is placed, the customer receives an instant ticket—like `#CW-1001` shown here—with a secure tracking token, so they only walk up to the counter when their chai is ready."

### Transition to Slide 3:
*"Now, let us examine the technical architecture and how the system manages concurrency behind the scenes."*

---

## Slide 3 — Technology Stack and System Architecture

**Target Time:** 40–50 seconds  
**Visual Focus:** Architecture diagram on the right and tech stack breakdown on the left.

### What to Say:
"For this project, I chose a clean, multi-tier architecture built with modern, production-grade tools.

[👉 *Point to the Frontend tier on the left*]
- **Frontend Presentation:** We use **React 19** with **Vite** for lightning-fast rendering. We write strictly typed code in **TypeScript** and use the native **HTML5 Web Audio API** for an opt-in ambient radio experience. All styling uses pure CSS design tokens, so switching between the 1900s and 2020s themes happens instantaneously without reloading the page.
- **State & Pricing:** We use React's **CartContext**. All prices are calculated in whole **paise** rather than floating-point rupees. This completely avoids precision bugs when calculating the 5% GST and packaging fees.

[👉 *Point to the System Architecture diagram on the right*]
- **Database & Concurrency:** On the backend, we use **Supabase (PostgreSQL 15)**. The most important technical challenge was preventing overbooking during rush hours. We solved this by writing a custom PostgreSQL function called `create_order`. It uses `SELECT FOR UPDATE` row-level locking. If two customers try to book the last available slot at the exact same millisecond, the database handles them safely one-by-one.
- **Offline Resilience:** For demonstration purposes, I also built a local storage mock engine that replicates the Supabase API. That means the entire application can run and take orders completely offline without needing external internet or API keys."

### Transition to Slide 4:
*"Next, let us look at the development process, how AI assistance was applied, and how the codebase was tested."*

---

## Slide 4 — Development Process, Prompts and Screenshots

**Target Time:** 40–45 seconds  
**Visual Focus:** Left timeline and prompts; right-hand test results and slot selector.

### What to Say:
"The development followed a disciplined 5-stage software lifecycle: starting from cultural research and PRD specifications, designing the tokenized design system, creating the relational database schema, implementing the reactive components, and finishing with automated testing.

[👉 *Point to the Reconstructed AI Development Prompts on the left*]
During development, AI tools like Google Antigravity were used to accelerate complex tasks. For example, instead of guessing SQL concurrency logic, we prompted the AI:
*'Write an atomic PostgreSQL function for a tea counter that reserves a 15-minute slot using SELECT FOR UPDATE to prevent race conditions during rush hours.'*
Similarly, we used AI to design the tokenized CSS variables that smoothly swap the brass 1900s theme with the lilac 2020s theme.

[👉 *Point to the 31/31 Test Harness visual at top right*]
To guarantee that the implementation is robust, we built an automated verification test harness. As shown here in the test terminal, **31 out of 31 architectural invariants passed**, verifying everything from catalogue data integrity and GST formulas to slot decrements and kitchen state transitions.

[👉 *Point to the Pickup Slot Selector at bottom right*]
Here on the bottom right, you can see the capacity-controlled checkout interface, clearly showing customers which slots are available, filling fast, or fully committed."

### Transition to Slide 5:
*"Finally, let us conclude with our project outcomes and repository access."*

---

## Slide 5 — Repository, Conclusion and Thank You

**Target Time:** 35–45 seconds  
**Visual Focus:** Takeaways on the left, clickable link and QR code on the right.

### What to Say:
"In conclusion, Chaiwala proves three key engineering outcomes:

1. **Culture and Technology Can Coexist:** Digital ordering does not have to feel cold. Engaging, dual-era storytelling makes the experience memorable while genuinely reducing physical queue times.
2. **Database Concurrency Matters:** By implementing row-level slot locking at the database level, we prevent kitchen panic and protect counter efficiency.
3. **Resilient Architecture:** The application can run anywhere—either fully connected to a cloud PostgreSQL database or standalone in offline browser storage.

[👉 *Point to the QR Code and GitHub link on the right*]
The entire codebase, SQL migration files, automated test harness, and our comprehensive 30-page academic report are publicly available on GitHub. You can scan the QR code right now on the screen with your smartphone camera to inspect the live repository.

Thank you very much for your time and guidance. I would be happy to answer any questions."

---

## Anticipated Viva & Evaluator Questions (With Honest, Practical Answers)

### Q1: Why did you create two eras (1900s and 2020s) instead of a regular food menu?
**Answer:**  
"Traditional tea counters have a strong cultural and social identity—in India, we call it 'Adda' culture. When people order through standard apps, that emotional connection is lost. The dual-era concept proves that software can provide speed and efficiency while still honoring cultural nostalgia. The 1900s Adda features classic cutting chai, bun maska, and vintage radio, while the 2020s Café caters to students looking for cold coffee, boba, and matcha."

### Q2: How exactly does your 15-minute pickup slot prevent rush-hour queue bottlenecks?
**Answer:**  
"In a normal counter, 30 people arrive at 10:00 AM and wait together, causing chaos. In Chaiwala, each 15-minute slot has a fixed capacity—defaulted to 6 orders. When 6 orders are booked, the slot automatically locks and switches to 'FULL', guiding subsequent customers to select 10:15 AM or 10:30 AM. This spaces out orders evenly and ensures the barista is never overwhelmed."

### Q3: What is the purpose of `SELECT FOR UPDATE` in your PostgreSQL stored procedure?
**Answer:**  
"If two customers order the last remaining spot in a 10:00 AM slot at the exact same millisecond, a standard `SELECT` query would show both that 1 spot is left, resulting in overbooking. `SELECT FOR UPDATE` places an exclusive row-level lock on that specific slot row during the transaction. The first request decrements the slot; the second request is immediately notified that the slot is full. This guarantees ACID transactional integrity."

### Q4: Why do you store prices in paise instead of rupees?
**Answer:**  
"Floating-point numbers in JavaScript and databases often cause rounding inaccuracies—such as `0.1 + 0.2 = 0.30000000000000004`. By storing prices as integers in paise (e.g., ₹25.00 is stored as 2500 paise), we can do exact integer arithmetic for product subtotals, packaging fees, and the 5% GST without any rounding drift."

### Q5: How was AI used in this project, and what did you implement yourself?
**Answer:**  
"AI was used as an intelligent engineering accelerator—similar to pair programming. We used AI prompts to research design patterns, explore CSS custom property tokens, and structure the PL/pgSQL stored procedures. The system design, database schema, React component architecture, 31-invariant test suite, and academic verification were developed and validated directly in the project repository."

### Q6: What are the current limitations of this prototype?
**Answer:**  
"First, the project name 'Chaiwala' is descriptive and used strictly for academic purposes; a commercial launch would require a distinct trademark. Second, online payment currently operates on a cash-at-counter or mock basis; integrating live UPI gateways like Razorpay with webhook verification is planned for the next milestone. Third, the ambient audio is strictly opt-in by user click to comply with browser autoplay restrictions."

