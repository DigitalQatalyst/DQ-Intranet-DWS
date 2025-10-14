import React, { useEffect, useRef, useState } from "react";
import { Phone, X } from "lucide-react";

export default function GetSupportCard() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState<{type:"ok"|"err"; text:string} | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  // lock page scroll when modal is open
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    if (open) setTimeout(() => firstFieldRef.current?.focus(), 0);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setMsg(null);
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name")||"").trim();
    const email = String(data.get("email")||"").trim();
    const message = String(data.get("message")||"").trim();
    if (!name || !email || !message) {
      setMsg({type:"err", text:"Please fill all fields."});
      setSending(false);
      return;
    }
    try {
      // Wire this when ready:
      // await fetch("/api/support", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ name, email, message, source:"DWS • Get Support" }) });
      await new Promise(res => setTimeout(res, 600)); // demo ok
      setMsg({type:"ok", text:"Thanks! Our team will get back to you shortly."});
      (e.target as HTMLFormElement).reset();
    } catch {
      setMsg({type:"err", text:"Something went wrong. Please try again."});
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* CARD */}
      <div className="rounded-2xl bg-white p-6 text-[#030F35] shadow-[0_10px_30px_rgba(3,15,53,0.12)]">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#FB5535]/10 flex items-center justify-center">
          <Phone className="w-6 h-6 text-[#FB5535]" />
        </div>
        <h3 className="mt-4 text-center text-xl font-semibold">Get Support</h3>
        <p className="mt-2 text-center text-sm text-[#0B1B4A]/75">
          Own — need help or guidance? Reach out to DQ Support to stay unblocked and keep work moving forward.
        </p>
        <div className="mt-6 flex justify-center">
          {/* IMPORTANT: button (not Link) to avoid navigation */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-xl px-5 py-3 font-medium text-white transition-transform hover:scale-[1.01] shadow-[0_6px_20px_rgba(3,15,53,0.18)]"
            style={{ background:"linear-gradient(135deg,#FB5535 0%,#1A2E6E 50%,#030F35 100%)" }}
          >
            Get in Touch →
          </button>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div
          role="dialog" aria-modal="true" aria-labelledby="dq-support-title"
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 w-[min(92vw,560px)] rounded-2xl border border-white/30 p-6 sm:p-7 shadow-[0_20px_60px_rgba(3,15,53,0.35)]"
               style={{ background:"linear-gradient(180deg,rgba(251,85,53,0.06),rgba(3,15,53,0.06))" }}>
            <div className="flex items-center justify-between">
              <h3 id="dq-support-title" className="text-xl font-semibold text-[#030F35]">Contact Us</h3>
              <button aria-label="Close" className="p-2 rounded-full hover:bg-black/5" onClick={() => setOpen(false)}>
                <X className="w-5 h-5 text-[#0B1B4A]" />
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={submit}>
              <div>
                <label htmlFor="dq-name" className="block text-sm font-medium text-[#0B1B4A]">Name</label>
                <input id="dq-name" name="name" ref={firstFieldRef}
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-[#FB5535]" />
              </div>
              <div>
                <label htmlFor="dq-email" className="block text-sm font-medium text-[#0B1B4A]">Email</label>
                <input id="dq-email" type="email" name="email"
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-[#FB5535]" />
              </div>
              <div>
                <label htmlFor="dq-message" className="block text-sm font-medium text-[#0B1B4A]">Message</label>
                <textarea id="dq-message" name="message" rows={4}
                  className="mt-1 w-full rounded-lg border border-black/10 bg-white/90 px-3 py-2 outline-none focus:ring-2 focus:ring-[#FB5535] resize-y"
                  placeholder="How can we help you?" />
              </div>

              {msg && (
                <p className={`text-sm rounded-lg p-2 border ${msg.type==="ok" ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>
                  {msg.text}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full rounded-xl px-5 py-3 font-semibold text-white disabled:opacity-70"
                style={{ background:"linear-gradient(135deg,#FB5535 0%,#1A2E6E 50%,#030F35 100%)" }}
              >
                {sending ? "Sending…" : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}