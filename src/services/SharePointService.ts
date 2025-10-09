// Minimal SharePoint service stub to be replaced with real Graph/SharePoint API calls
// Returns a predictable list of files given a folderPath string like "DT2.0 DESIGN/Design"

export interface SharePointFileItem {
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


