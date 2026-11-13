export type Skill = { id: string; name: string; percent: number; category: string; color: string; featured?: boolean };
export const SKILL_FILTERS = ["All", "Programming", "Frontend", "Backend", "API", "AI", "Data", "Developer Tools", "Operating Systems", "Databases", "DevOps", "Architecture", "Computer Science"] as const;
export const SKILLS: Skill[] = [
  { id: "python", name: "Python", percent: 90, category: "Programming", color: "#3776AB", featured: true },
  { id: "nextjs", name: "Next.js", percent: 75, category: "Frontend", color: "#ffffff", featured: true },
  { id: "typescript", name: "TypeScript", percent: 95, category: "Programming", color: "#3178C6", featured: true },
  { id: "react", name: "React", percent: 90, category: "Frontend", color: "#61DAFB", featured: true },
  { id: "tailwind", name: "Tailwind CSS", percent: 80, category: "Frontend", color: "#38BDF8", featured: true },
  { id: "fastapi", name: "FastAPI", percent: 90, category: "Backend", color: "#009688", featured: true },
  { id: "ml", name: "Machine Learning", percent: 85, category: "AI", color: "#a78bfa", featured: true },
  { id: "git", name: "Git", percent: 95, category: "Developer Tools", color: "#F05032", featured: true },
  { id: "restapi", name: "RestAPI", percent: 80, category: "API", color: "#38BDF8" },
  { id: "graphql", name: "GraphQL", percent: 60, category: "API", color: "#E535AB" },
  { id: "ai", name: "Artificial Intelligence", percent: 80, category: "AI", color: "#c084fc" },
  { id: "datascience", name: "Data Science", percent: 80, category: "Data", color: "#67e8f9" },
  { id: "linux", name: "Linux", percent: 90, category: "Operating Systems", color: "#FCC624" },
  { id: "mysql", name: "MySQL", percent: 75, category: "Databases", color: "#4479A1" },
  { id: "redis", name: "Redis", percent: 80, category: "Databases", color: "#DC382D" },
  { id: "docker", name: "Docker", percent: 75, category: "DevOps", color: "#2496ED" },
  { id: "c", name: "C", percent: 75, category: "Programming", color: "#A8B9CC" },
  { id: "systemdesign", name: "System Design", percent: 60, category: "Architecture", color: "#818cf8" },
  { id: "dsa", name: "DSA", percent: 75, category: "Computer Science", color: "#a78bfa" },
  { id: "java", name: "Java", percent: 50, category: "Programming", color: "#ED8B00" },
];
