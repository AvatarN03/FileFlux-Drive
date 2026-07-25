"use client";
import { features } from "@/constant";
import { motion } from "motion/react";

const Features = () => {
  return (
    <section
      id="features"
      className="min-h-screen w-screen bg-violet text-peach p-8"
    >
      <div className="flex flex-col gap-8 justify-center items-center my-10">
        <h2 className="text-3xl md:text-5xl">Features</h2>
        <p className="text-brown max-w-3xl text-center text-base md:text-xl mb-4">
          Secure file uploads with folder organization, storage-limit
          enforcement, and fast preview/download access, backed by authenticated
          APIs and real-time updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-8 my-8 max-7 overflow-x-hidden">
        {features.map((feature, idx) => (
          <motion.div
            initial={{
              opacity: 0,
              y: idx % 2 ? 100 : -100,
            }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            // viewport={{ once: true, amount: 0.5 }}
            key={idx}
            className={`${feature.class} relative min-h-64 flex justify-center text-ember rounded-2xl p-4`}
          >
            <h1 className="my-8 text-3xl md:text-4xl text-violet">
              {feature.title}
            </h1>
            <p className="font-medium w-[75%] text-base">
              {feature.description}
            </p>
            <div className={`absolute ${feature.pos}`}>
              <feature.icon className="text-violet w-12 h-12 md:w-18 md:h-18" />
            </div>
            <div
              className={`absolute ${feature.cut} w-16 sm:w-28 h-16 bg-violet rounded-xl
                `}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
