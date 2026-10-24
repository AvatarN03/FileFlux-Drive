"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PRICING_PLANS } from "@/constant";
import { Check, ArrowRight } from "lucide-react";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="w-full py-20 lg:py-28 bg-brand-cream-muted border-b border-brand-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 border border-brand-border bg-brand-cream text-brand-brown text-xs font-semibold uppercase tracking-wider mb-4 rounded-none">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-violet tracking-tight mb-4">
            Simple, Predictable Plans for Everyone
          </h2>
          <p className="text-base sm:text-lg text-brand-violet/75 leading-relaxed">
            Start completely free or upgrade to expanded quotas and dedicated
            support as your digital storage requirements grow.
          </p>
        </div>

        {/* Normal Side-by-Side Pricing Cards (Strictly No Rounded Corners) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PRICING_PLANS.map((plan, idx) => {
            const isHighlighted = !!plan.highlight;
            const Icon = plan.icon;

            return (
              <motion.div
                key={plan.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex flex-col justify-between p-8 bg-brand-cream transition-all duration-200 rounded-none ${
                  isHighlighted
                    ? "border-2 border-brand-brown shadow-md bg-brand-cream"
                    : "border border-brand-border hover:border-brand-brown/60"
                }`}
              >
                {/* Popular Ribbon / Badge for Highlighted Plan */}
                {isHighlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-brown text-brand-cream px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest border border-brand-brown-dark rounded-none">
                    Most Popular
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 border border-brand-border bg-brand-cream-muted flex items-center justify-center text-brand-brown rounded-none">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-2xl font-bold text-brand-violet">
                        {plan.name}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-brand-violet/75 mb-6 min-h-8">
                    {plan.description}
                  </p>

                  {/* Pricing Display */}
                  <div className="pb-6 mb-6 border-b border-brand-border/80">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-extrabold text-brand-violet tracking-tight">
                        {plan.price}
                      </span>
                      <span className="text-xs text-brand-violet/60 font-medium">
                        / {plan.duration}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-brand-brown">
                      <span>Storage: {plan.limits.storageMB} MB</span>
                      <span>•</span>
                      <span>Max File: {plan.limits.maxFileSizeMB} MB</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-violet/60">
                      What&apos;s Included:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, fIdx) => (
                        <li
                          key={fIdx}
                          className="flex items-center gap-2.5 text-xs text-brand-violet font-medium"
                        >
                          <span className="w-4 h-4 bg-brand-peach/50 border border-brand-border flex items-center justify-center text-brand-brown shrink-0 rounded-none">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                          <span>{feature.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Plan CTA (No rounded corners) */}
                <div className="pt-4 border-t border-brand-border/60">
                  <Link
                    href="/auth?continueTo=dashboard"
                    className={`w-full py-3 px-4 font-semibold text-sm flex items-center justify-center gap-2 transition-colors rounded-none ${
                      isHighlighted
                        ? "bg-brand-brown hover:bg-brand-brown-dark text-brand-cream border border-brand-brown"
                        : "bg-brand-cream-muted hover:bg-brand-violet hover:text-brand-cream text-brand-violet border border-brand-border hover:border-brand-violet"
                    }`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
