"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import {
  FEATURE_BENTO_CARDS,
  FEATURE_CARD_BASE_CLASS,
  FEATURES_SECTION_CONTENT,
} from "@/constant";

type FeatureCard = (typeof FEATURE_BENTO_CARDS)[number];
type FeatureVisualizationData = FeatureCard["visualization"];

const FeatureVisualization = ({
  visualization,
}: {
  visualization: FeatureVisualizationData;
}) => {
  switch (visualization.kind) {
    case "encryption":
      return (
        <div className="bg-brand-violet-dark p-4 border-2 border-brand-violet text-brand-cream mb-2">
          <div className="text-[11px] font-mono text-brand-peach-vibrant font-bold mb-3 flex items-center justify-between">
            <span>{visualization.label}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {visualization.status}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {visualization.steps.map((step) => (
              <div
                key={step.title}
                className={`p-3 border ${step.className}`}
              >
                <div
                  className={`text-[10px] uppercase font-bold ${step.titleClass}`}
                >
                  {step.title}
                </div>
                <div
                  className={`font-mono truncate mt-1 ${step.primaryClass}`}
                >
                  {step.primary}
                </div>
                <div className={`text-[10px] mt-0.5 ${step.secondaryClass}`}>
                  {step.secondary}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "storage":
      return (
        <div className="p-4 bg-brand-cream border-2 border-brand-border space-y-3">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-brand-violet">
              {visualization.label}
            </span>
            <span className="font-mono text-xs font-bold text-brand-brown">
              {visualization.value}
            </span>
          </div>
          <div className="w-full h-3 bg-brand-cream-muted border border-brand-border flex overflow-hidden">
            {visualization.segments.map((segment) => (
              <div
                key={segment.label}
                className={`h-full ${segment.barClass}`}
                title={segment.title}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] font-mono text-brand-violet/80">
            {visualization.segments.map((segment) => (
              <div
                key={segment.label}
                className="flex items-center gap-1.5 truncate"
              >
                <span
                  className={`w-2 h-2 inline-block shrink-0 ${segment.dotClass}`}
                />
                <span>
                  {segment.label} ({segment.percent}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case "formats":
      return (
        <div className="grid grid-cols-3 gap-2 bg-brand-cream border-2 border-brand-border p-3 text-center">
          {visualization.items.map((item) => (
            <div
              key={item.format}
              className="p-2 bg-brand-cream-muted border border-brand-border"
            >
              <div
                className={`font-mono font-bold text-xs ${item.formatClass}`}
              >
                {item.format}
              </div>
              <div className="text-[9px] text-brand-violet/70">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      );

    case "sharing": {
      const DetailIcon = visualization.detailIcon;

      return (
        <div className="bg-brand-cream border-2 border-brand-border p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-brand-violet">
              {visualization.accessLabel}
            </span>
            <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              {visualization.accessValue}
            </span>
          </div>
          <div className="p-2 bg-brand-violet-dark text-brand-peach font-mono text-[11px] truncate border border-brand-violet flex items-center gap-2">
            <DetailIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{visualization.detail}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-brand-violet/75">
            <span>{visualization.roadmapLabel}</span>
            <span className="font-bold text-brand-brown">
              {visualization.policy}
            </span>
          </div>
        </div>
      );
    }

    case "folder-tree": {
      const RootIcon = visualization.rootIcon;

      return (
        <div className="bg-brand-cream border-2 border-brand-border p-3 space-y-1.5 font-mono text-xs">
          <div className="flex items-center gap-2 text-brand-violet font-bold">
            <RootIcon className="w-3.5 h-3.5 text-brand-brown" />
            <span>{visualization.root}</span>
            <span className="text-[9px] text-brand-peach-vibrant font-bold ml-auto">
              {visualization.status}
            </span>
          </div>
          {visualization.children.map((item) => {
            const ItemIcon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-2 text-brand-violet/80 pl-4 border-l border-brand-border"
              >
                <ItemIcon className={`w-3 h-3 ${item.iconClass}`} />
                <span className="truncate">{item.label}</span>
              </div>
            );
          })}
        </div>
      );
    }
  }
};

const FeatureCard = ({ card }: { card: FeatureCard }) => {
  const CardIcon = card.icon;
  const FooterIcon = card.footer.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: card.delay }}
      className={`${FEATURE_CARD_BASE_CLASS} ${card.className}`}
    >
      <div>
        {card.eyebrow ? (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center justify-center rounded-none ${card.iconContainerClass}`}
              >
                <CardIcon className={card.iconClass} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-brown">
                  {card.eyebrow}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-brand-violet group-hover:text-brand-brown transition-colors">
                  {card.title}
                </h3>
              </div>
            </div>
            <span className={card.badgeClass}>{card.badge}</span>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div
                className={`flex items-center justify-center rounded-none ${card.iconContainerClass}`}
              >
                <CardIcon className={card.iconClass} />
              </div>
              <span className={card.badgeClass}>{card.badge}</span>
            </div>
            <h3 className="text-xl font-bold text-brand-violet mb-2 group-hover:text-brand-brown transition-colors">
              {card.title}
            </h3>
          </>
        )}

        <p
          className={`text-brand-violet/85 leading-relaxed ${card.descriptionClass}`}
        >
          {card.description}
        </p>

        <FeatureVisualization visualization={card.visualization} />
      </div>

      <div
        className={`mt-6 border-t border-brand-border flex items-center justify-between text-xs ${card.footer.className}`}
      >
        <span className="flex items-center gap-1.5">
          {"pulse" in card.footer && card.footer.pulse ? (
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          ) : null}
          {card.footer.text}
        </span>
        <FooterIcon className={card.footer.iconClass} />
      </div>
    </motion.article>
  );
};

const Features = () => {
  return (
    <section
      id="features"
      className="relative w-full py-20 lg:py-28 border-b-2 border-brand-border overflow-hidden"
    >
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border-l-4 border-y border-r border-brand-violet-dark bg-brand-violet text-brand-peach text-xs font-bold uppercase tracking-wider mb-4 shadow-brown-2 rounded-none">
            <Sparkles className="w-3.5 h-3.5 text-brand-peach-vibrant" />
            <span>{FEATURES_SECTION_CONTENT.eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-violet tracking-tight mb-4">
            {FEATURES_SECTION_CONTENT.title}
          </h2>
          <p className="text-base sm:text-lg text-brand-violet/85 leading-relaxed">
            {FEATURES_SECTION_CONTENT.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {FEATURE_BENTO_CARDS.map((card) => (
            <FeatureCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
