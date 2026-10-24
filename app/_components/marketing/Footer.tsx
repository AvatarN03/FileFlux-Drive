import Link from "next/link";
import { GithubIcon, LinkedinIcon, ArrowUpRight } from "lucide-react";
import Logo from "../Logo";

const Footer = () => {
  return (
    <footer className="w-full bg-brand-violet text-brand-cream border-t-2 border-brand-violet-dark pt-16 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brand-violet-light/40">
          {/* Brand Info with Current Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block text-brand-cream">
              <Logo classes="text-brand-cream" />
            </div>
            <p className="text-sm text-brand-cream-muted/80 max-w-sm leading-relaxed">
              FileFlux is a next-generation file management platform engineered
              for developers and teams who demand speed, security, and
              zero-knowledge personal privacy.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="https://github.com/AvatarN03"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-brand-violet-light bg-brand-violet-dark hover:bg-brand-brown hover:border-brand-brown text-brand-cream flex items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#FFA552] rounded-none"
                title="GitHub"
              >
                <GithubIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://linkedin.com/in/prashanth-naidu03"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-brand-violet-light bg-brand-violet-dark hover:bg-brand-brown hover:border-brand-brown text-brand-cream flex items-center justify-center transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#FFA552] rounded-none"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-peach mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-cream-muted/80">
              <li>
                <Link href="#home" className="hover:text-brand-peach transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-brand-peach transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/auth?continueTo=dashboard"
                  className="hover:text-brand-peach transition-colors inline-flex items-center gap-1 group"
                >
                  Dashboard{" "}
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Vault */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-peach mb-4">
              Security
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-cream-muted/80">
              <li>
                <span className="text-brand-cream-muted/65 hover:text-brand-cream transition-colors cursor-default">
                  Client-Side Vault
                </span>
              </li>
              <li>
                <span className="text-brand-cream-muted/65 hover:text-brand-cream transition-colors cursor-default">
                  Libsodium Crypto
                </span>
              </li>
              <li>
                <span className="text-brand-cream-muted/65 hover:text-brand-cream transition-colors cursor-default">
                  Quota Enforcement
                </span>
              </li>
              <li>
                <span className="text-brand-cream-muted/65 hover:text-brand-cream transition-colors cursor-default">
                  Token Authentication
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-peach mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-cream-muted/80">
              <li>
                <span className="hover:text-brand-peach transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-brand-peach transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-brand-peach transition-colors cursor-pointer">
                  Acceptable Use
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-brand-cream-muted/70">
          <div>
            &copy; {new Date().getFullYear()} FileFlux. Built by{" "}
            <span className="text-brand-peach font-semibold">Prashanth Naidu</span>.
            All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-brand-cream-muted">Core Services Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
