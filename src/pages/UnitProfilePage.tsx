import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HomeIcon, ChevronRightIcon, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import type { WorkUnitRow, WorkUnit } from "@/data/workDirectoryTypes";
import { getPerformanceStatusClasses, getPriorityLevelClasses } from "@/components/work-directory/unitStyles";

const UNIT_COLUMNS =
  "id, slug, sector, unit_name, unit_type, mandate, location, focus_tags, priority_level, priority_scope, performance_status, wi_areas, banner_image_url";

const mapUnit = (row: WorkUnitRow): WorkUnit => ({
  id: row.id,
  slug: row.slug,
  sector: row.sector,
  unitName: row.unit_name,
  unitType: row.unit_type,
  mandate: row.mandate,
  location: row.location,
  focusTags: Array.isArray(row.focus_tags) ? row.focus_tags : [],
  priorityLevel: row.priority_level,
  priorityScope: row.priority_scope,
  performanceStatus: row.performance_status,
  wiAreas: Array.isArray(row.wi_areas) ? row.wi_areas : [],
  bannerImageUrl: row.banner_image_url ?? null,
});

const UnitProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [unit, setUnit] = useState<WorkUnit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchUnit = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("work_units")
        .select(UNIT_COLUMNS)
        .eq("slug", slug)
        .single();

      if (fetchError) {
        console.error("Failed to load unit", fetchError);
        setError(fetchError.message);
        setUnit(null);
      } else if (data) {
        setUnit(mapUnit(data as WorkUnitRow));
      }
      setLoading(false);
    };

    fetchUnit();
  }, [slug]);

  const priorityClasses = getPriorityLevelClasses(unit?.priorityLevel);
  const performanceClasses = getPerformanceStatusClasses(unit?.performanceStatus);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setSidebarOpen((prev) => !prev)} sidebarOpen={sidebarOpen} />
      <main className="container mx-auto px-4 py-10 flex-grow space-y-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm text-gray-600">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
                <HomeIcon size={16} className="mr-1" />
                Home
              </Link>
            </li>
            <li className="inline-flex items-center text-gray-500">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <Link to="/marketplace/work-directory" className="ml-1 hover:text-gray-800">
                DQ Work Directory
              </Link>
            </li>
            <li className="inline-flex items-center text-gray-500">
              <ChevronRightIcon size={16} className="text-gray-400" />
              <span className="ml-1">Units</span>
            </li>
            {unit && (
              <li className="inline-flex items-center text-gray-700">
                <ChevronRightIcon size={16} className="text-gray-400" />
                <span className="ml-1">{unit.unitName}</span>
              </li>
            )}
          </ol>
        </nav>

        {loading && <div className="text-sm text-gray-500">Loading unit profile…</div>}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            Failed to load unit details. {error}
          </div>
        )}

        {unit && (
          <>
            <section className="rounded-3xl bg-gradient-to-br from-[#030F35] via-[#1A2E6E] to-[#4B61D1] text-white shadow-xl p-6 sm:p-10 space-y-4">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-blue-100">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white">{unit.unitType}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white">{unit.sector}</span>
              </div>
              <div>
                <p className="text-sm text-blue-100 flex items-center gap-2">
                  <MapPin size={16} className="text-blue-200" />
                  {unit.location}
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold mt-2">{unit.unitName}</h1>
              </div>
              <div className="flex flex-wrap gap-3">
                {unit.priorityLevel && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/10 ${priorityClasses}`}>
                    {unit.priorityLevel}
                  </span>
                )}
                {unit.performanceStatus && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-white/10 ${performanceClasses}`}>
                    {unit.performanceStatus}
                  </span>
                )}
              </div>
              {unit.focusTags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {unit.focusTags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-white/10 text-white/90">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-3">Unit Mandate</h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-line">{unit.mandate}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Unit Details</h3>
                <dl className="space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-700">Sector</dt>
                    <dd>{unit.sector}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-700">Unit type</dt>
                    <dd>{unit.unitType}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-medium text-slate-700">Location</dt>
                    <dd>{unit.location}</dd>
                  </div>
                  {unit.wiAreas && (
                    <div className="flex justify-between gap-4">
                      <dt className="font-medium text-slate-700">WI areas</dt>
                      <dd>{unit.wiAreas.length}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Current Focus &amp; Priorities</h2>
                  <p className="text-sm text-slate-500">How this unit is performing and what they are tackling next.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {unit.priorityLevel && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${priorityClasses}`}>
                      {unit.priorityLevel}
                    </span>
                  )}
                  {unit.performanceStatus && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${performanceClasses}`}>
                      {unit.performanceStatus}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-slate-700 leading-relaxed">
                {unit.priorityScope || "No current priority scope has been added."}
              </p>
            </section>

            {unit.wiAreas && unit.wiAreas.length > 0 && (
              <section className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-4">
                <h2 className="text-xl font-semibold text-slate-900">WI Areas</h2>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {unit.wiAreas.map((area) => (
                    <li key={area} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                      {area}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-2xl border border-dashed border-slate-200 bg-white shadow-sm p-6 text-sm text-slate-500">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Related Associates</h2>
              <p>Coming soon: this section will auto-populate with associates mapped to this unit.</p>
            </section>
          </>
        )}
      </main>
      <Footer isLoggedIn={false} />
    </div>
  );
};

export default UnitProfilePage;
