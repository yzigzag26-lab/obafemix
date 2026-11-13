export type Project = {
  id: string;
  title: string;
  aside: string; // Caveat line beside title
  category: string; // filter category
  tags: string; // comma-separated chips, e.g. "Web App, African Language Tech"
  featured: boolean;
  status: string;
  description: string;
  description2: string;
  role: string;
  contributions: string[]; // chips
  stack: string[]; // chips
  liveUrl: string;
  githubUrl: string;
  image: string; // /assets/... path, external URL, or data URL from upload
  imageAlt: string;
  caption: string; // Caveat caption under media
  location: string;
  year: string;
};

export const PROJECT_CATEGORIES = ["Web Apps", "African Language Tech", "Open Source", "Mobile Apps", "Backend & APIs", "Other"] as const;
export const PROJECT_ROLES = ["Full-Stack Developer", "Frontend Developer", "Backend Developer", "Developer", "Contributor", "Maintainer"] as const;
export const PROJECT_STATUSES = ["Live", "In Progress", "Completed", "Archived", "Coming Soon"] as const;
export const CONTRIBUTION_OPTIONS = ["Frontend Development", "Backend Development", "API Integration", "Product Architecture", "Product Development", "UI / UX Design", "Database Design", "Deployment & DevOps", "Testing", "Documentation", "Open Source Maintenance"] as const;
export const STACK_OPTIONS = ["React", "Next.js", "TypeScript", "JavaScript", "Node.js", "REST APIs", "MongoDB", "Supabase", "Tailwind CSS", "Vercel", "Git & GitHub", "Linux"] as const;
export const IMAGE_PRESETS = [
  { label: "WAZOBIA lockup (cream artwork)", value: "/assets/wazobia-lockup.webp" },
  { label: "Abstract project background", value: "/assets/project-bg.webp" },
  { label: "Skills / toolbench background", value: "/assets/skills-bg.webp" },
  { label: "Contact / desk background", value: "/assets/contact-bg.webp" },
  { label: "Custom image URL (paste below)", value: "custom" },
  { label: "Uploaded image (choose file below)", value: "upload" },
] as const;
export const LOCATION_OPTIONS = ["Nigeria", "Lagos State, Nigeria", "Remote", "Africa", "Global"] as const;
export const YEAR_OPTIONS = ["2026", "2025", "2024", "2023"] as const;

export const defaultProject: Project = {
  id: "wazobia",
  title: "WAZOBIA",
  aside: "the African language ecosystem",
  category: "African Language Tech",
  tags: "Web App, African Language Tech",
  featured: true,
  status: "Live",
  description: "WAZOBIA is an African language technology ecosystem — Nigeria first, built for Africa. It makes Yorùbá, Hausa and Igbo fully usable in everyday digital tools: translation, structured learning, pronunciation and cultural preservation, with English as a bridge language.",
  description2: "A language held only in speech is one generation from being lost. WAZOBIA exists so that learning, translating and preserving an African language does not require leaving it behind.",
  role: "Full-Stack Developer",
  contributions: ["Frontend Development", "Backend Development", "API Integration", "Product Architecture", "Product Development"],
  stack: ["React", "TypeScript", "Vercel"],
  liveUrl: "https://wazobia-omega.vercel.app/",
  githubUrl: "https://github.com/yzigzag26-lab",
  image: "/assets/wazobia-lockup.webp",
  imageAlt: "WAZOBIA — The African Language Ecosystem logo",
  caption: "Africa speaks. Let's understand every voice.",
  location: "Nigeria",
  year: "2026",
};

export const emptyProject: Project = {
  id: "", title: "", aside: "", category: "Web Apps", tags: "", featured: false, status: "Live",
  description: "", description2: "", role: "Full-Stack Developer", contributions: [], stack: [],
  liveUrl: "", githubUrl: "", image: "/assets/project-bg.webp", imageAlt: "", caption: "", location: "Nigeria", year: "2026",
};

export const filtersFor = (projects: Project[]) => {
  const cats = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  // keep the site's original filter order first when present
  const order = ["All", "Web Apps", "African Language Tech", "Open Source"];
  return [...order.filter((c) => cats.includes(c)), ...cats.filter((c) => !order.includes(c))]
    .map((label) => ({ label, count: label === "All" ? projects.length : projects.filter((p) => p.category === label).length }));
};
