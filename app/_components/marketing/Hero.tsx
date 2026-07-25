"use client";
import Image from "next/image";
import Link from "next/link";

import { motion } from "motion/react";

const Hero = () => {
  return (
    <section
      id="home"
      className="bg-gradient-62 min-h-screen  w-screen p-4 relative isolate overflow-hidden"
    >
      {/* Blur layer - isolated at the back */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-ember blur-[80px] absolute top-0 -right-32 opacity-80" />
        <div className="w-96 h-96 rounded-full bg-ember blur-[80px] absolute bottom-0 -left-32 opacity-70" />
      </div>

      {/* Arrow images - separate layer, no blur */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <motion.div
          initial={{
            opacity: 0,
            y: 100,
          }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className=" block absolute bottom-20 right-20 w-62 h-62"
        >
          <Image
            width={120}
            height={120}
            alt="arrow-up"
            src={"/arrow-up.png"}
            className="w-full h-full"
          />
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 100,
          }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.5 }}
          className="hidden lg:block absolute top-1/4 left-20 w-62 h-62"
        >
          <Image
            width={120}
            height={120}
            alt="arrow-up"
            src={"/arrow-up.png"}
            className="w-full h-full"
          />
        </motion.div>
      </div>

      {/* Content layer - centered and clear */}
      <div className="relative z-20 flex items-center pt-8 justify-center min-h-[60vh]">
        <div className="flex flex-col justify-center items-center gap-8 w-full max-w-5xl text-center px-4">
          <motion.h1
            initial={{
              y: -100,
              opacity: 0,
            }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-7xl xl:text-8xl font-semibold text-violet leading-tight"
          >
            Upload, Manage & Share Your Files{" "}
            <span className="text-ember">Effortlessly</span>
          </motion.h1>

          <p className="text-violet/70 font-normal text-lg md:text-xl max-w-2xl">
            A fast, AI-powered file management platform with secure storage,
            preview support, and smart insights.
          </p>

          <motion.div
            initial={{
              y: 100,
              opacity: 0,
            }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Link
              href={"/auth?continueTo=dashboard"}
              role="button"
              className="bg-violet px-6 py-3 rounded-md text-peach shadow-md hover:text-brown hover:shadow-2xl transition-all"
            >
              Get started
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
