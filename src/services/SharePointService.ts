// Minimal SharePoint service stub to be replaced with real Graph/SharePoint API calls
// Returns a predictable list of files given a folderPath string like "DT2.0 DESIGN/Design"

export interface SharePointFileItem {
export interface SharePointFile {
  id: string;
  name: string;
  url?: string;
  size?: number;
  lastModified?: string;
}

function fakeDelay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function listFiles(folderPath: string): Promise<SharePointFileItem[]> {
  // Simulate network delay
  await fakeDelay(300);
  // For now, just return mocked files based on folderPath
  const base = folderPath.replace(/\//g, '-').toLowerCase();
  return [
    {
      id: `${base}-1`,
      name: `Readme for ${folderPath}.pdf`,
      url: '#',
      size: 1024 * 120,
      lastModified: new Date().toISOString()
    },
    {
      id: `${base}-2`,
      name: `Overview ${folderPath}.pptx`,
      url: '#',
      size: 1024 * 640,
      lastModified: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: `${base}-3`,
      name: `Checklist ${folderPath}.xlsx`,
      url: '#',
      size: 1024 * 220,
      lastModified: new Date(Date.now() - 5 * 86400000).toISOString()
    }
  ];
}


// Temporary stub implementation until real SharePoint integration is available.
// Returns a handful of mock files so that the Asset Library page can render.
export async function listFiles(path: string): Promise<SharePointFile[]> {
  return Promise.resolve(
    [
      {
        id: `${path}-guide`,
        name: 'Agile Working Guide.pdf',
        url: '#',
        size: 2.4,
        lastModified: '2025-01-12'
      },
      {
        id: `${path}-playbook`,
        name: 'Collaboration Playbook.pptx',
        url: '#',
        size: 5.8,
        lastModified: '2025-02-03'
      },
      {
        id: `${path}-template`,
        name: 'Sprint Retro Template.xlsx',
        url: '#',
        size: 0.9,
        lastModified: '2025-01-28'
      }
    ]
  );
}
