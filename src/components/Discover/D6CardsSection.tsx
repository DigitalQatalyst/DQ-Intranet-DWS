import React, { useState } from 'react';

type Accelerator = {
   id: string;
   acronym: string;
   subtitle: string;
   description: string;
   icon: string;
   iconGradient: string;
   tags: string[];
   hasCourses?: boolean;
 };
 
const ACCELERATORS: Accelerator[] = [
   {
     id: "dtmp",
     acronym: "DTMP",
     subtitle: "Digital Transformation Management Platform",
     description:
       "Supports the design, deployment, and governance of digital transformation initiatives — enabling structured workflows, performance tracking, and capability development.",
     icon: "🎛️",
     iconGradient: "linear-gradient(135deg,#e4ebff,#c7d2ff)",
     tags: ["Workflows", "Governance", "Insights"],
   },
   {
     id: "tmaas",
     acronym: "TMaaS",
     subtitle: "Transformation Management as a Service",
     description:
       "A flexible, on-demand marketplace offering affordable digital transformation services, enhanced with AI-driven customization to suit specific organizational needs.",
     icon: "🧩",
     iconGradient: "linear-gradient(135deg,#ffe8cc,#ffd5a1)",
     tags: ["Pods", "AI Custom", "Marketplace"],
   },
   {
     id: "dto4t",
     acronym: "DTO4T",
     subtitle: "Digital Twin of Organization for Transformation",
     description:
       "A digital toolkit for training and transformation teams with templates, resources, and interactive modules for learning, organizational development, and change enablement.",
     icon: "🧱",
     iconGradient: "linear-gradient(135deg,#dff5ff,#bde6ff)",
     tags: ["Template Kits", "Learning", "Change"],
   },
   {
     id: "dtmb",
     acronym: "DTMB",
     subtitle: "Digital Transformation Media & Brand",
     description:
       "Creates, designs, and delivers digital content and creative assets for the DQ ecosystem — graphics, copywriting, videos, and multimedia used across DQ platforms.",
     icon: "🎨",
     iconGradient: "linear-gradient(135deg,#ffe3da,#ffc3b0)",
     tags: ["Content", "Creative", "Launch"],
   },
   {
     id: "dtmi",
     acronym: "DTMI",
     subtitle: "Digital Transformation Management Insights",
     description:
       "An AI-powered online magazine with expert perspectives on Digital Cognitive Organizations, blending research-based articles and a curated resource marketplace for practical tools and guidance.",
     icon: "🧠",
     iconGradient: "linear-gradient(135deg,#dffcf1,#bbf5de)",
     tags: ["AI Insights", "Research", "Marketplace"],
   },
   {
     id: "dtma",
     acronym: "DTMA",
     subtitle: "Digital Transformation Management Academy",
     description:
       "Offers data-driven insights, dashboards, and learning paths focused on talent metrics and operational performance — supporting strategic decision-making.",
     icon: "📚",
     iconGradient: "linear-gradient(135deg,#efe3ff,#d9c5ff)",
     tags: ["Dashboards", "Learning Paths", "Talent"],
     hasCourses: true,
   },
 ];
 
const CTA_PRIMARY =
  "inline-flex w-full min-w-[130px] items-center justify-center rounded-xl bg-[#030F35] px-4 py-2.5 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:bg-[#1A2E6E] whitespace-nowrap";
 
export function D6CardsSection() {
   const [active, setActive] = useState<Accelerator | null>(null);
 
   return (
     <section className="bg-[#F9FAFB] py-16">
       <div className="mx-auto max-w-6xl px-6 md:px-10">
         <div className="text-center">
          <h2
            className="font-serif text-[30px] md:text-[34px] font-bold text-black"
            style={{ fontFamily: '"Playfair Display", Georgia, "Times New Roman", serif' }}
          >
            DQ | 6x Digital Architecture
          </h2>
           <p className="mt-3 text-sm md:text-[15px] text-slate-500 max-w-2xl mx-auto">
             Six DQ accelerators curated for the Digital Workspace product suite. Tap a card to explore the full profile.
           </p>
         </div>
 
        <div className="mt-10 grid items-stretch gap-5 md:gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {ACCELERATORS.map((acc) => (
            <article
               key={acc.id}
               role="button"
               tabIndex={0}
               onClick={() => setActive(acc)}
               onKeyDown={(e) => {
                 if (e.key === "Enter" || e.key === " ") {
                   e.preventDefault();
                   setActive(acc);
                 }
               }}
              className="flex min-h-[380px] flex-col rounded-3xl border border-[#E6E8F2] bg-white p-5 shadow-[0_8px_20px_-12px_rgba(2,6,23,0.15)] transition-all hover:-translate-y-[1px] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1A2E6E]/40"
            >
              <div className="flex flex-1 flex-col">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span
                      className="grid h-12 w-12 place-items-center rounded-2xl text-xl"
                      style={{ background: acc.iconGradient }}
                    >
                       {acc.icon}
                     </span>
                     <div>
                       <p className="text-[15px] font-bold text-slate-900">{acc.acronym}</p>
                       <p className="text-[13.5px] text-slate-700">{acc.subtitle}</p>
                     </div>
                   </div>
 
                   <div className="flex flex-wrap gap-2 text-[11.5px]">
                     {acc.tags.map((tag) => (
                       <span key={tag} className="rounded-full bg-[#F1F3FA] px-3 py-1 font-medium text-slate-600">
                         {tag}
                       </span>
                     ))}
                   </div>
 
                  <p className="text-[13.5px] leading-6 text-slate-700 line-clamp-4 description-clip">
                    {acc.description}
                  </p>
                </div>

                <div className="mt-3 h-[2px] w-full rounded-full bg-gradient-to-r from-[#FB5535] via-[#FF9C66] to-[#FED7AA] opacity-70" />

                <div className={`mt-auto pt-3 ${acc.hasCourses ? "grid grid-cols-2" : "grid grid-cols-1"} gap-3`}>
                  <a
                    href={`#knowledge-${acc.id}`}
                    className={CTA_PRIMARY}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Explore Hub
                  </a>
                  {acc.hasCourses && (
                    <a
                      href="#courses"
                      className={CTA_PRIMARY}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {acc.id === "dtma" ? "Start Learning" : "Courses"}
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
       </div>
 
       {active && (
         <div
           className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-8"
           role="dialog"
           aria-modal="true"
           onClick={() => setActive(null)}
         >
           <div
             className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"
             onClick={(e) => e.stopPropagation()}
           >
             <div className="flex items-start gap-3">
               <span
                 className="grid h-12 w-12 place-items-center rounded-2xl text-xl"
                 style={{ background: active.iconGradient }}
               >
                 {active.icon}
               </span>
               <div className="flex-1">
                 <p className="text-[16px] font-bold text-slate-900">{active.acronym}</p>
                 <p className="text-[13.5px] text-slate-700">{active.subtitle}</p>
               </div>
               <button
                 onClick={() => setActive(null)}
                 className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
                 aria-label="Close"
               >
                 ✕
               </button>
             </div>
 
             <div className="mt-4 flex flex-wrap gap-2 text-[11.5px]">
               {active.tags.map((tag) => (
                 <span key={tag} className="rounded-full bg-[#F1F3FA] px-3 py-1 font-medium text-slate-600">
                   {tag}
                 </span>
               ))}
             </div>
 
            <p className="mt-4 text-[14px] leading-relaxed text-slate-500">
              {active.description}
            </p>

            <div className="mt-4 h-[2px] w-full rounded-full bg-gradient-to-r from-[#FB5535] via-[#FF9C66] to-[#FED7AA] opacity-70" />

            <div className={`mt-3 ${active.hasCourses ? "grid grid-cols-2" : "grid grid-cols-1"} gap-3`}>
              <a href={`#knowledge-${active.id}`} className={CTA_PRIMARY}>
                Explore Hub
              </a>
              {active.hasCourses && (
                <a href="#courses" className={CTA_PRIMARY}>
                  {active.id === "dtma" ? "Start Learning" : "Courses"}
                </a>
              )}
            </div>
           </div>
         </div>
       )}
     </section>
   );
}
