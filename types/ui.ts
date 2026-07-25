import { LucideIcon } from "lucide-react";


export type FeatureType = {
    title:string;
    description:string;
    icon:LucideIcon;
    class?:string;
    pos:string;
    cut:string
}


export type NavSection = {
  key: string;
  icon: LucideIcon;
  label: string;
  href: string;
};