import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabaseClient } from '../../../lib/supabaseClient';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import { useAuth } from '../../../components/Header/context/AuthContext';

const GHC_SLUGS = [
  'dq-vision',
  'dq-hov',
  'dq-persona',
  'dq-agile-tms',
  'dq-agile-sos',
  'dq-agile-flows',
  'dq-agile-6xd'
];

interface Guide {
  id: string;
  slug: string;
  title: string;
  body: string | null;
  summary: string | null;
  hero_image_url: string | null;
  last_updated_at: string | null;
  status: string | null;
  domain: string | null;
  guide_type: string | null;
}

export default function GHCInspectorPage() {
  const { user } = useAuth();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGuides() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabaseClient
          .from('guides')
          .select('id, slug, title, body, summary, hero_image_url, last_updated_at, status, domain, guide_type')
          .in('slug', GHC_SLUGS)
          .order('slug');

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        setGuides(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch guides');
      } finally {
        setLoading(false);
      }
    }

    fetchGuides();
  }, []);

  // Check for duplicates
  const slugCounts: Record<string, number> = {};
  guides.forEach(guide => {
    slugCounts[guide.slug] = (slugCounts[guide.slug] || 0) + 1;
  });
  const duplicates = Object.entries(slugCounts).filter(([slug, count]) => count > 1);

  // Check for missing slugs
  const foundSlugs = new Set(guides.map(g => g.slug));
  const missingSlugs = GHC_SLUGS.filter(slug => !foundSlugs.has(slug));

  // Check for shared body content
  const bodyMap = new Map<string, Guide[]>();
  guides.forEach(guide => {
    if (!guide.body) return;
    const bodyHash = guide.body.substring(0, 500);
    if (!bodyMap.has(bodyHash)) {
      bodyMap.set(bodyHash, []);
    }
    bodyMap.get(bodyHash)!.push(guide);
  });
  const sharedBodies = Array.from(bodyMap.entries()).filter(([hash, guides]) => guides.length > 1);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">GHC Database Inspector</h1>
              <p className="text-gray-600">View what's stored in Supabase for each GHC element</p>
            </div>
            <Link 
              to="/admin/guides" 
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Back to Guides
            </Link>
          </div>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="text-gray-600">Loading...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 font-semibold">Error:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Total Found</div>
                <div className="text-2xl font-bold text-gray-900">{guides.length}</div>
                <div className="text-xs text-gray-500 mt-1">of {GHC_SLUGS.length} expected</div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Missing</div>
                <div className={`text-2xl font-bold ${missingSlugs.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {missingSlugs.length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Duplicates</div>
                <div className={`text-2xl font-bold ${duplicates.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {duplicates.length}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">Shared Content</div>
                <div className={`text-2xl font-bold ${sharedBodies.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {sharedBodies.length}
                </div>
              </div>
            </div>

            {/* Issues */}
            {missingSlugs.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 font-semibold mb-2">⚠️ Missing Slugs:</p>
                <ul className="list-disc list-inside text-yellow-700">
                  {missingSlugs.map(slug => (
                    <li key={slug}>{slug}</li>
                  ))}
                </ul>
              </div>
            )}

            {duplicates.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-semibold mb-2">❌ Duplicate Slugs Found:</p>
                {duplicates.map(([slug, count]) => {
                  const dupGuides = guides.filter(g => g.slug === slug);
                  return (
                    <div key={slug} className="mb-2">
                      <p className="text-red-700 font-medium">"{slug}": {count} records</p>
                      <ul className="list-disc list-inside text-red-600 ml-4">
                        {dupGuides.map(g => (
                          <li key={g.id}>ID: {g.id}, Title: {g.title}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {sharedBodies.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-800 font-semibold mb-2">❌ Shared Body Content Detected:</p>
                {sharedBodies.map(([hash, guidesWithSameBody], idx) => (
                  <div key={idx} className="mb-4">
                    <p className="text-red-700 font-medium mb-1">
                      Found in {guidesWithSameBody.length} guide(s):
                    </p>
                    <ul className="list-disc list-inside text-red-600 ml-4">
                      {guidesWithSameBody.map(g => (
                        <li key={g.id}>{g.slug} (ID: {g.id})</li>
                      ))}
                    </ul>
                    <p className="text-xs text-red-500 mt-1">
                      Preview: {hash.substring(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Guide Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Guide Details</h2>
              <div className="space-y-6">
                {guides.map((guide) => {
                  const bodyLength = guide.body ? guide.body.length : 0;
                  const bodyPreview = guide.body 
                    ? guide.body.substring(0, 150).replace(/\n/g, ' ').trim()
                    : 'EMPTY';
                  
                  const sameBodyGuides = guides.filter(g => 
                    g.id !== guide.id && 
                    g.body && 
                    guide.body && 
                    g.body === guide.body
                  );

                  return (
                    <div key={guide.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{guide.slug}</h3>
                          <p className="text-sm text-gray-600">{guide.title || '(no title)'}</p>
                        </div>
                        {sameBodyGuides.length > 0 && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                            ⚠️ Shared Content
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">ID:</span>
                          <p className="font-mono text-xs text-gray-700 break-all">{guide.id}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className="text-gray-700">{guide.status || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Domain:</span>
                          <p className="text-gray-700">{guide.domain || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Updated:</span>
                          <p className="text-gray-700 text-xs">
                            {guide.last_updated_at 
                              ? new Date(guide.last_updated_at).toLocaleDateString()
                              : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <span className="text-gray-500 text-sm">Body Content:</span>
                        <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">
                            Length: {bodyLength} characters
                          </p>
                          <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap break-words">
                            {bodyPreview}{bodyLength > 150 ? '...' : ''}
                          </p>
                        </div>
                      </div>

                      {sameBodyGuides.length > 0 && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-xs text-red-700 font-semibold">
                            ⚠️ This content is IDENTICAL to:
                          </p>
                          <ul className="text-xs text-red-600 mt-1">
                            {sameBodyGuides.map(g => (
                              <li key={g.id}>• {g.slug} (ID: {g.id})</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      <Footer isLoggedIn={!!user} />
    </div>
  );
}

export default GHCInspectorPage;
