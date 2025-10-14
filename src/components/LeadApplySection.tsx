import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Briefcase, Phone } from "lucide-react";
import { FadeInUpOnScroll } from "./AnimationUtils";

const floatingShapes = [
  { size: 120, color: "rgba(3,15,53,0.15)", delay: 0, duration: 15, className: "top-[10%] left-[5%]" },
  { size: 80, color: "rgba(251, 85, 53, 0.18)", delay: 1.8, duration: 18, className: "top-[32%] left-[14%]" },
  { size: 150, color: "rgba(3,15,53,0.12)", delay: 1, duration: 20, className: "bottom-[18%] left-[12%]" },
  { size: 100, color: "rgba(255,255,255,0.12)", delay: 2.6, duration: 16, className: "top-[22%] right-[12%]" },
  { size: 70, color: "rgba(3,15,53,0.10)", delay: 2.1, duration: 14, className: "top-[60%] right-[6%]" },
  { size: 130, color: "rgba(251, 85, 53, 0.20)", delay: 1.2, duration: 22, className: "bottom-[12%] right-[18%]" },
];

type CardConfig = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
};

const LeadApplySection = () => {
  const navigate = useNavigate();

  const cards = useMemo<CardConfig[]>(
    () => [
      {
        id: "card-1",
        icon: <Users size={28} className="text-[#FB5535]" />,
        title: "Open DQ Workspace",
        description:
          "Lead — access tools, services, and dashboards that help you work smarter every day.",
        cta: "Open Now →",
        onClick: () => navigate("/register"),
      },
      {
        id: "card-2",
        icon: <Briefcase size={28} className="text-[#FB5535]" />,
        title: "Become a Lead",
        description:
          "Co-work — take the next step in your DQ journey. Apply for a Lead role, mentor associates, and help shape how our workspace grows.",
        cta: "Apply Now →",
        onClick: () => window.dispatchEvent(new Event("open-lead-popup")),
      },
      {
        id: "card-3",
        icon: <Phone size={28} className="text-[#FB5535]" />,
        title: "Get Support",
        description:
          "Own — need help or guidance? Reach out to DQ Support to stay unblocked and keep work moving forward.",
        cta: "Get in Touch →",
        onClick: () => navigate("/support"),
      },
    ],
    [navigate]
  );

  return (
    <section
      id="ready-move"
      className="relative overflow-hidden bg-[linear-gradient(135deg,#FB5535_0%,#1A2E6E_50%,#030F35_100%)] py-20 pb-16 md:pb-20 text-white scroll-mt-[96px]"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingShapes.map(({ size, color, delay, duration, className }, index) => (
          <div
            key={`${index}-${size}`}
            className={`absolute rounded-full opacity-30 animate-float ${className}`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              background: color,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 text-center">
        <FadeInUpOnScroll>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Move Work Forward?
          </h2>
        </FadeInUpOnScroll>
        <FadeInUpOnScroll delay={0.2}>
          <p className="text-lg text-gray-200 mb-12 max-w-3xl mx-auto">
            Get started in the Digital Workspace — lead, co-work, and grow together.
          </p>
        </FadeInUpOnScroll>

        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {cards.map(({ id, icon, title, description, cta, onClick }, idx) => (
            <FadeInUpOnScroll key={id} delay={0.3 + idx * 0.2} className="flex">
              <article className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between w-[320px] h-[350px] transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <div className="inline-flex items-center justify-center">
                      {icon}
                    </div>
                  </div>
                  <h3 className="text-[#030F35] font-semibold text-lg mb-3">{title}</h3>
                  <p className="text-gray-600 mb-5 leading-relaxed">{description}</p>
                </div>
                <button
                  type="button"
                  onClick={onClick}
                  className="bg-[#030F35] text-white py-2 px-4 rounded-md hover:bg-[#FB5535] transition-all mt-auto mx-auto"
                >
                  {cta}
                </button>
              </article>
            </FadeInUpOnScroll>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0);
            opacity: 0.3;
          }
          33% {
            transform: translateY(-30px) translateX(20px) rotate(5deg);
            opacity: 0.6;
          }
          66% {
            transform: translateY(20px) translateX(-15px) rotate(-3deg);
            opacity: 0.4;
          }
          100% {
            transform: translateY(0) translateX(0) rotate(0);
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default LeadApplySection;
