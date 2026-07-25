"use client";
import { useState } from "react";

import { motion } from "motion/react";

import { PRICING_PLANS } from "@/constant";

const Pricing = () => {
  const [hoverIdx, setHoverIdx] = useState<number>(0);

  const handleHover = (idx: number) => {
    setHoverIdx(idx);
  };

  return (
    <section
      id="pricing"
      className="p-4 min-h-screen w-screen bg-gradient-62 relative z-10"
    >
      <div className="absolute inset-0 w-full h-full custom-clip bg-ember z-0" />
      <div className="relative z-10">
        <div className="flex flex-col gap-8 justify-center items-center my-10">
          <h2 className="text-3xl md:text-5xl">Pricing</h2>
          <p className="text-ember max-w-3xl text-center text-base md:text-xl mb-4">
            Secure file uploads with folder organization, storage-limit
            enforcement, and fast preview/download access, backed by
            authenticated APIs and real-time updates.
          </p>
        </div>

        <motion.div
          initial={{
            y: 100,
            opacity: 0,
          }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          // viewport={{ once: true, amount: 0.5 }}
          className="flex flex-col md:flex-row justify-center gap-6 md:gap-16 xl:gap-24 max-w-7xl mx-auto"
        >
          {PRICING_PLANS.map((plan, idx) => {
            const isActive = hoverIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => handleHover(idx)}
                className={`
              transition-all duration-700 ease-in-out cursor-pointer relative overflow-hidden
              rounded-xl text-peach p-5 w-full md:max-w-sm
              md:max-h-[500px]
              ${
                isActive
                  ? "md:flex-1 bg-violet"
                  : "md:flex-[0.1] bg-violet md:bg-green md:text-violet"
              }
            `}
              >
                {/* Collapsed State - Rotated Title (Desktop Only) */}
                <div
                  className={`
                hidden md:flex items-center gap-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                transition-all duration-500 ease-in-out
                ${
                  isActive
                    ? "rotate-0 opacity-0 -translate-x-full"
                    : "rotate-90 opacity-100 -translate-x-1/2"
                }
              `}
                >
                  <plan.icon className="w-8 h-8" />
                  <h3 className="text-2xl font-semibold whitespace-nowrap">
                    {plan.name}
                  </h3>
                </div>

                {/* Expanded State - Content */}
                <div
                  className={`
                md:transition-all md:duration-700 md:ease-in-out md:delay-200
                ${
                  isActive
                    ? "opacity-100 translate-y-0"
                    : "md:opacity-0 md:translate-y-16 md:pointer-events-none"
                }
              `}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <plan.icon className="w-8 h-8" />
                    <h3 className="text-2xl font-semibold">{plan.name}</h3>
                  </div>

                  <p className="text-sm opacity-80 mb-4">{plan.description}</p>

                  <div className="flex flex-col gap-4">
                    <h1>{plan.duration}</h1>
                    <h2 className="text-3xl font-bold">{plan.price}</h2>

                    <div className="flex flex-col text-sm">
                      <p>Storage: {plan.limits.storageMB} MB</p>
                      <p>Max file size: {plan.limits.maxFileSizeMB} MB</p>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="flex flex-col gap-3 my-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <feature.icon className="w-4 h-4" />
                        {feature.label}
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-2 rounded-lg font-medium bg-peach text-violet hover:opacity-90 transition-opacity">
                    Get Started
                  </button>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;
