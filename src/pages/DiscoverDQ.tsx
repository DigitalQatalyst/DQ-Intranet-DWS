import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { XIcon } from "lucide-react";
import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import Discover_VisionMissionSection from "../components/Discover/Discover_VisionMissionSection";
import Discover_DNASection from "../components/Discover/Discover_DNASection";
import Discover_SixDigitalSection from "../components/Discover/Discover_SixDigitalSection";
import Discover_DirectorySection from "../components/Discover/Discover_DirectorySection";
import MapCard from "../components/map/MapCard";
import type { LocationItem } from "../api/MAPAPI";
import Discover_HeroSection from "../components/Discover/Discover_HeroSection";
import styles from "./DiscoverDQ.module.css";

const DiscoverDQ: React.FC = () => {
  const navigate = useNavigate();
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportStatus, setSupportStatus] = useState<string | null>(null);
  const [isSubmittingSupport, setSubmittingSupport] = useState(false);
  type ClientFilterKey =
    | "STC"
    | "SAIB"
    | "NEOM"
    | "ADIB"
    | "Khalifa Fund"
    | "Khalifa Fund EJ"
    | "DEWA"
    | "DFSA"
    | "SCA"
    | "MoI";

  type ClientLocation = LocationItem & {
    filterKey: ClientFilterKey;
    markerColor: string;
  };

  const CLIENT_LOCATIONS: ClientLocation[] = [
    {
      id: "stc-riyadh",
      name: "Saudi Telecom Company (stc)",
      type: "Client",
      address: "Saudi Telecom Company (stc)",
      city: "Riyadh",
      country: "Saudi Arabia",
      coordinates: { lng: 46.6753, lat: 24.7136 },
      markerColor: "#7C3AED", // purple
      filterKey: "STC",
      website: "https://www.stc.com.sa/",
      description:
        "A leading Saudi telecommunications and digital services group delivering connectivity, cloud, and enterprise solutions.",
    },
    {
      id: "saib-riyadh",
      name: "The Saudi Investment Bank (SAIB)",
      type: "Client",
      address: "The Saudi Investment Bank (SAIB)",
      city: "Riyadh",
      country: "Saudi Arabia",
      coordinates: { lng: 46.6753, lat: 24.7136 },
      markerColor: "#1F2933", // dark gray/black-gold vibe
      filterKey: "SAIB",
      website: "https://www.saib.com.sa/",
      description:
        "A Saudi financial institution providing corporate, retail, and investment banking services across the Kingdom.",
    },
    {
      id: "neom-tabuk",
      name: "NEOM",
      type: "Client",
      address: "NEOM",
      city: "Tabuk Region",
      country: "Saudi Arabia",
      coordinates: { lng: 35.1128, lat: 28.1122 },
      markerColor: "#D97706", // gold
      filterKey: "NEOM",
      website: "https://www.neom.com/",
      description:
        "A Saudi giga-project initiative applying advanced enterprise architecture to enable a future-ready smart city.",
    },
    {
      id: "adib-abu-dhabi",
      name: "Abu Dhabi Islamic Bank (ADIB)",
      type: "Client",
      address: "Abu Dhabi Islamic Bank (ADIB)",
      city: "Abu Dhabi",
      country: "United Arab Emirates",
      coordinates: { lng: 54.3773, lat: 24.4539 },
      markerColor: "#162862", // dark blue
      filterKey: "ADIB",
      website: "https://www.adib.ae/",
      description:
        "A UAE-based Sharia-compliant bank offering retail, corporate, and wholesale Islamic financial services.",
    },
    {
      id: "kf-abu-dhabi",
      name: "Khalifa Fund for Enterprise Development",
      type: "Client",
      address: "Khalifa Fund for Enterprise Development",
      city: "Abu Dhabi",
      country: "United Arab Emirates",
      coordinates: { lng: 54.3773, lat: 24.4539 },
      markerColor: "#16A34A", // green
      filterKey: "Khalifa Fund",
      website: "https://www.khalifafund.ae/",
      description:
        "A UAE government-backed entity supporting SMEs through funding, advisory services, and entrepreneurship programs.",
    },
    {
      id: "kf-ej-abu-dhabi",
      name: "Khalifa Fund – Enterprise Journey",
      type: "Client",
      address: "Khalifa Fund – Enterprise Journey",
      city: "Abu Dhabi",
      country: "United Arab Emirates",
      coordinates: { lng: 54.3773, lat: 24.4539 },
      markerColor: "#16A34A", // green
      filterKey: "Khalifa Fund EJ",
      website: "https://www.khalifafund.ae/",
      description:
        "A structured digital initiative supporting enterprise growth and governance within the UAE ecosystem.",
    },
    {
      id: "dewa-dubai",
      name: "Dubai Electricity & Water Authority (DEWA)",
      type: "Client",
      address: "Dubai Electricity & Water Authority (DEWA)",
      city: "Dubai",
      country: "United Arab Emirates",
      coordinates: { lng: 55.2708, lat: 25.2048 },
      markerColor: "#16A34A", // green (primary)
      filterKey: "DEWA",
      website: "https://www.dewa.gov.ae/",
      description:
        "Dubai's primary utility provider delivering electricity, water, and smart infrastructure services.",
    },
    {
      id: "dfsa-dubai",
      name: "Dubai Financial Services Authority (DFSA)",
      type: "Client",
      address: "Dubai Financial Services Authority (DFSA)",
      city: "Dubai",
      country: "United Arab Emirates",
      coordinates: { lng: 55.2708, lat: 25.2048 },
      markerColor: "#4B5563", // dark gray
      filterKey: "DFSA",
      website: "https://www.dfsa.ae/",
      description:
        "The independent regulator overseeing financial services conducted in or from the Dubai International Financial Centre.",
    },
    {
      id: "sca-abu-dhabi",
      name: "Securities & Commodities Authority (SCA)",
      type: "Client",
      address: "Securities & Commodities Authority (SCA)",
      city: "Abu Dhabi",
      country: "United Arab Emirates",
      coordinates: { lng: 54.3773, lat: 24.4539 },
      markerColor: "#D97706", // gold
      filterKey: "SCA",
      website: "https://www.sca.gov.ae/",
      description:
        "The UAE federal authority regulating securities markets and protecting investor interests.",
    },
    {
      id: "moi-i360-abu-dhabi",
      name: "UAE Ministry of Interior (MoI – I360)",
      type: "Client",
      address: "UAE Ministry of Interior (MoI – I360)",
      city: "Abu Dhabi",
      country: "United Arab Emirates",
      coordinates: { lng: 54.3773, lat: 24.4539 },
      markerColor: "#DC2626", // red accent
      filterKey: "MoI",
      website: "https://www.moi.gov.ae/",
      description:
        "A UAE Ministry of Interior initiative enabling integrated digital intelligence and data-driven security operations.",
    },
  ];

  const CLIENT_FILTERS: { key: ClientFilterKey; label: string }[] = [
    { key: "STC", label: "STC" },
    { key: "SAIB", label: "SAIB" },
    { key: "NEOM", label: "NEOM" },
    { key: "ADIB", label: "ADIB" },
    { key: "Khalifa Fund", label: "Khalifa Fund" },
    { key: "Khalifa Fund EJ", label: "Khalifa Fund EJ" },
    { key: "DEWA", label: "DEWA" },
    { key: "DFSA", label: "DFSA" },
    { key: "SCA", label: "SCA" },
    { key: "MoI", label: "MoI" },
  ];

  const [selectedTypes, setSelectedTypes] = useState<Set<ClientFilterKey>>(new Set());
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const prefersReducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (!supportOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSupportOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [supportOpen]);

  const filteredLocations = useMemo(() => {
    if (!selectedTypes.size) return CLIENT_LOCATIONS;
    return CLIENT_LOCATIONS.filter((location) => selectedTypes.has(location.filterKey));
  }, [selectedTypes]);

  useEffect(() => {
    if (!selectedLocationId) return;
    if (!filteredLocations.some((location) => location.id === selectedLocationId)) {
      setSelectedLocationId(null);
    }
  }, [filteredLocations, selectedLocationId]);

  const toggleType = (type: LocationCategory) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const clearTypes = () => {
    setSelectedTypes(new Set());
    setSelectedLocationId(null);
  };

  const handleExploreLearningCenter = () => {
    navigate("/resource-coming-soon?title=DQ%20Learning%20Center%20(Courses%20%26%20Curricula)");
  };

  const handleExploreKnowledgeCenter = () => {
    navigate("/insight-coming-soon?title=DQ%20Knowledge%20Center%20(Work%20Guide%20-%20Strategy)");
  };

  const handleSupportSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (isSubmittingSupport) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !email || !message) {
      setSupportStatus("Please complete all fields.");
      return;
    }
    setSubmittingSupport(true);
    setSupportStatus(null);
    setTimeout(() => {
      setSubmittingSupport(false);
      setSupportStatus("Thanks! A DQ specialist will reply shortly.");
      event.currentTarget.reset();
    }, 900);
  };

  return (
    <>
      <Header />
      <main
        id="app-content"
        className={`${styles.dwsDiscover} ${prefersReducedMotion ? styles.reducedMotion : ""} relative z-0 bg-transparent`}
      >
        {/* Hero */}
        <Discover_HeroSection />

        {/* Map Section */}
        <section
          id="growth-areas"
          className="bg-white py-20 scroll-mt-[72px]"
        >
          <div className="mx-auto flex max-w-6xl flex-col px-6 text-center sm:px-10 lg:px-12">
            <h2
              className="font-bold text-center"
              style={{
                fontFamily:
                  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                fontSize: "30px",
                fontWeight: 700,
                fontStyle: "normal",
                textTransform: "none",
                textAlign: "center",
                color: "#162862", // DWS Primary Dark Blue
                margin: 0,
              }}
            >
              Discover the DigitalQatalyst Ecosystem
            </h2>
            <p
              className="mx-auto max-w-[680px]"
              style={{
                fontFamily:
                  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                fontSize: "16px",
                fontWeight: 400,
                fontStyle: "normal",
                lineHeight: 1.5,
                textAlign: "center",
                textTransform: "none",
                color: "#4B5563",
                marginTop: "16px",
                marginBottom: "24px",
              }}
            >
              Explore DigitalQatalyst’s clients and partners through verified engagement locations across key regional markets.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-[1226px] px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
              {CLIENT_FILTERS.map(({ key, label }) => {
                const location = CLIENT_LOCATIONS.find((loc) => loc.filterKey === key);
                const color = location?.markerColor ?? "#162862";
                const isActive = selectedTypes.has(key);

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleType(key)}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: isActive ? color : "#FFFFFF",
                      border: `1.5px solid ${color}`,
                      color: isActive ? "#FFFFFF" : color,
                      boxShadow: isActive ? `0 4px 12px ${color}40` : "none",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
              {selectedTypes.size > 0 && (
                <button
                  type="button"
                  onClick={clearTypes}
                  className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border border-[#162862] text-[#162862] bg-white hover:bg-[#162862] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative z-0 h-[420px] md:h-[520px] lg:h-[608px] xl:h-[608px] overflow-hidden rounded-2xl bg-white shadow-xl">
              <MapCard
                className="h-full w-full"
                locations={filteredLocations}
                selectedId={selectedLocationId}
                onSelect={(location: LocationItem) => setSelectedLocationId(location.id)}
                onClearFilters={selectedTypes.size ? clearTypes : undefined}
              />
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <Discover_VisionMissionSection />

        {/* DQ DNA */}
        <Discover_DNASection
          onExploreLearningCenter={handleExploreLearningCenter}
          onExploreKnowledgeCenter={handleExploreKnowledgeCenter}
        />

        {/* Six Digital Architecture */}
        <Discover_SixDigitalSection />

        {/* Directory */}
        <Discover_DirectorySection />

        {supportOpen && (
          <div className={styles.modalOverlay} role="dialog" aria-modal="true">
            <div className={styles.modalCard}>
              <div className={styles.modalHeader}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                    DQ Support
                  </div>
                  <div style={{ color: "var(--dws-muted)" }}>
                    Our support desk responds within one business day.
                  </div>
                </div>
                <button
                  className={styles.closeButton}
                  onClick={() => setSupportOpen(false)}
                  aria-label="Close support form"
                >
                  <XIcon size={18} />
                </button>
              </div>
              <form className={styles.modalBody} onSubmit={handleSupportSubmit}>
                <label>
                  <span style={{ color: "var(--dws-muted)" }}>Name</span>
                  <input
                    name="name"
                    type="text"
                    required
                    style={{
                      width: "100%",
                      padding: "0.9rem 1rem",
                      borderRadius: "12px",
                      border: `1px solid var(--dws-border)`
                    }}
                  />
                </label>
                <label>
                  <span style={{ color: "var(--dws-muted)" }}>Work Email</span>
                  <input
                    name="email"
                    type="email"
                    required
                    style={{
                      width: "100%",
                      padding: "0.9rem 1rem",
                      borderRadius: "12px",
                      border: `1px solid var(--dws-border)`
                    }}
                  />
                </label>
                <label>
                  <span style={{ color: "var(--dws-muted)" }}>How can we help?</span>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    style={{
                      width: "100%",
                      padding: "0.9rem 1rem",
                      borderRadius: "12px",
                      border: `1px solid var(--dws-border)`
                    }}
                  />
                </label>
                {supportStatus && <div style={{ color: "var(--dws-muted)" }}>{supportStatus}</div>}
                <div className={styles.modalFooter}>
                  <button type="button" className={styles.closeButton} onClick={() => setSupportOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className={styles.btnPrimary} disabled={isSubmittingSupport}>
                    {isSubmittingSupport ? "Sending…" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default DiscoverDQ;
