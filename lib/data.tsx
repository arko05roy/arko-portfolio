import { Chip } from "@/components/ui";
// All site content lives here. Replace the placeholders with your own details.

export const profile = {
  name: "Arko Roy",
  handle: "@notarkoroy",
  handleUrl: "https://x.com/notarkoroy",
  avatar: "https://avatars.githubusercontent.com/u/239588308?v=4",
  role: "developer",
  hackathonWins: 16,
  location: "India",
  status: { text: "Open to new roles", url: "mailto:arkoroy302@gmail.com" },
  bio: [
    <><b>16× hackathon winner</b> and <Chip logo="/logos/ethglobal.png" href="https://ethglobal.com">ETHGlobal</Chip> bounty winner, plus a <Chip logo="/logos/colosseum.png" href="https://www.colosseum.com">Colosseum</Chip> track win</>,
    <><Chip logo="/logos/stellar.png" href="https://stellar.org">Stellar</Chip> <b>ambassador</b> for India</>,
    <>Frontend mentor at <Chip logo="/logos/gdg.png" href="https://gdg.community.dev">GDG HITK</Chip></>,
  ],
  email: "arkoroy302@gmail.com",
  resumeUrl: "/resume.pdf",
  githubRepo: "https://github.com/arko05roy",
  copyrightYear: 2026,
  quote: "how bored can you be to spend time reading this?",
};

export const socials = [
  { label: "Twitter", url: "https://x.com/notarkoroy" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/arkoroyy/" },
  { label: "GitHub", url: "https://github.com/arko05roy" },
  { label: "Email", url: `mailto:${profile.email}` },
  { label: "Resume", url: profile.resumeUrl },
];

export const community = {
  twitter: { name: profile.name, handle: profile.handle, url: "https://x.com/notarkoroy" },
  discord: {
    name: "Your Community",
    tagline: "For Developers",
    url: "https://discord.gg/your-invite",
    logo: "",
  },
};

export const communities = [
  { name: "Superteam India", role: "Member", logo: "/logos/superteam.png", url: "https://in.superteam.fun" },
  { name: "Stellar India", role: "Ambassador", logo: "/logos/stellar.png", url: "https://stellar.org" },
  { name: "HackQuest", role: "Ambassador", logo: "/logos/hackquest.png", url: "https://www.hackquest.io" },
];

export type ExpStatus = "present" | "past" | "future";

export const experience: {
  company: string;
  url?: string;
  logo?: string;
  role: string;
  period: string;
  status: ExpStatus;
  bullets: string[];
}[] = [
  {
    company: "Supermission",
    logo: "/logos/supermission.png",
    role: "Blockchain Full Stack Developer",
    period: "Oct 2025 - Oct 2026",
    status: "past",
    bullets: [
      "Architected autonomous AI agents using x402 and ERC-8004 for agentic payments and multi-step task orchestration",
      "Shipped prediction markets, A2A payments and fixed end-to-end user workflows",
    ],
  },
  {
    company: "VENQ",
    logo: "/logos/venq.png",
    role: "Blockchain Full Stack Developer",
    period: "Jun 2025 - Sep 2025",
    status: "past",
    bullets: [
      "Deployed an ERC-1155 fractionalization contract for real estate tokenization, powering 10x growth in asset handling",
      "Migrated a legacy investment platform to Next.js and Tailwind, improving performance by 60%",
    ],
  },
  {
    company: "Research Commons",
    logo: "/logos/research-commons.png",
    role: "Frontend Developer Intern",
    period: "Apr 2025 - Jun 2025",
    status: "past",
    bullets: ["Delivered responsive, modular UI components with Next.js and Tailwind alongside backend and product teams"],
  },
];

export type Project = {
  name: string;
  description: string;
  image: string;
  tech: string[];
  live?: string;
  github?: string;
  status?: "live" | "building";
  award?: string;
  logo?: string;
};

export const projects: Project[] = [
  {
    name: "finity",
    logo: "/projects/finity.png",
    image: "/shots/finity-click.jpg",
    description: "Fund a fresh Hyperliquid trading account from shielded Zcash, trade perps, and send proceeds back, keeping wallet history separate.",
    tech: ["Zcash", "Hyperliquid", "TypeScript"],
    live: "https://finity.click",
    github: "https://github.com/Ithaca-Labs/finity",
    status: "live",
  },
  {
    name: "openx402",
    logo: "/projects/openx402.png",
    image: "/shots/stellarx402-xyz.jpg",
    description: "A self-hostable x402 v2 payment facilitator for Stellar, with Bazaar cataloging, a seller metadata SDK and an agent-facing MCP server.",
    tech: ["Stellar", "x402", "MCP", "TypeScript"],
    award: "Stellar Jaipur Residency winner",
    live: "https://stellarx402.xyz",
    github: "https://github.com/Ithaca-Labs/openx402",
    status: "live",
  },
  {
    name: "Tyr",
    logo: "/projects/tyr.png",
    image: "/shots/tyr-six-vercel-app.jpg",
    description: "Private, cross-venue prediction markets: bets that aren't a public record tied to your wallet, across every venue from one account.",
    tech: ["Prediction markets", "TypeScript"],
    live: "https://tyr-six.vercel.app",
    github: "https://github.com/arko05roy/tyr",
    status: "live",
  },
  {
    name: "Envelope",
    logo: "/projects/envelope.svg",
    image: "/shots/envelope-web-coral-vercel-app.jpg",
    description: "Private treasury and payroll OS for crypto-native teams: FHE-shielded salaries, programmable treasury controls and stealth payouts for 30+ contractors across 12+ countries.",
    tech: ["Solana", "Anchor", "Next.js", "FHE"],
    award: "Solana Frontier 2026 winner",
    live: "https://envelope-web-coral.vercel.app",
    github: "https://github.com/arko05roy/Envelope",
    status: "live",
  },
  {
    name: "Verdict",
    logo: "/projects/verdict.png",
    image: "/shots/verdict-jade-vercel-app.jpg",
    description: "A universal zero-knowledge integrity protocol that verifies state transitions across apps through 10 layered checks, without exposing private data.",
    tech: ["Midnight", "Compact", "TypeScript", "SNARKs"],
    award: "Midnight Foundation grant",
    live: "https://verdict-jade.vercel.app",
    github: "https://github.com/arko05roy/VERDICT",
    status: "live",
  },
  {
    name: "Icaruz",
    image: "/shots/icaruz-web-vercel-app.jpg",
    description: "Cache-aware mixture-of-brains on BTL Runtime. One question, many experts. Pay once for context and pay the people who wrote it.",
    tech: ["AI", "BTL Runtime", "TypeScript"],
    award: "BTL Runtime hackathon winner",
    live: "https://icaruz-web.vercel.app",
    github: "https://github.com/arko05roy/Icaruz",
    status: "live",
  },
  {
    name: "dev.eth",
    image: "/shots/dev-eth-vercel-app.jpg",
    description: "A learning game cut from the complete Devcon and ETHGlobal archives: 4,371 talks across 142 events, ranked, threaded and played.",
    tech: ["Ethereum", "TypeScript"],
    live: "https://dev-eth.vercel.app",
    github: "https://github.com/arko05roy/dev.eth",
    status: "live",
  },
  {
    name: "Lisan",
    image: "/shots/lisan-gamma-vercel-app.jpg",
    description: "Private and instant BTC transfers.",
    tech: ["Bitcoin", "Privacy", "TypeScript"],
    live: "https://lisan-gamma.vercel.app",
    github: "https://github.com/arko05roy/Lisan-",
    status: "live",
  },
  {
    name: "Swarm",
    image: "https://opengraph.githubassets.com/1/arko05roy/Swarm",
    description: "AI agents that borrow from DeFi pools, get hired by other AIs, and attract investors who earn revenue share.",
    tech: ["AI agents", "DeFi", "JavaScript"],
    github: "https://github.com/arko05roy/Swarm",
  },
  {
    name: "TVA Protocol",
    image: "https://opengraph.githubassets.com/1/arko05roy/tva-stellar",
    description: "An EVM compatibility layer on Stellar: compiles standard Solidity to Soroban WebAssembly, with an RPC layer that works with Hardhat, Foundry and MetaMask.",
    tech: ["Rust", "Soroban", "Solidity"],
    github: "https://github.com/arko05roy/tva-stellar",
  },
  {
    name: "Praxis",
    logo: "/projects/praxis.png",
    image: "/shots/praxis-steel-vercel-app.jpg",
    description: "Execution Rights, a DeFi primitive that lets traders run strategies on vault capital without custody, backed by ERC-721 reputation tokens instead of liquidations.",
    tech: ["Solidity", "Flare", "Noir", "Groth16"],
    award: "Flare Foundation grant",
    live: "https://praxis-steel.vercel.app",
    github: "https://github.com/arko05roy/Praxis",
    status: "live",
  },
  {
    name: "Arx Protocol",
    logo: "/projects/arx.png",
    image: "https://opengraph.githubassets.com/1/arko05roy/Arx-Protocol",
    description: "A Layer-3 on OP Stack with Proof-of-Impact consensus for environmental verification, ERC-1155 carbon credits, prediction markets and Celo → Ethereum settlement.",
    tech: ["OP Stack", "Solidity", "Go", "Foundry"],
    award: "CELO Kolkata winner",
    github: "https://github.com/arko05roy/Arx-Protocol",
  },
  {
    name: "InnoFund",
    image: "https://opengraph.githubassets.com/1/arko05roy/InnoFund",
    description: "A DeSci platform where researchers raise funds for their projects, with on-chain proposals and voting.",
    tech: ["DeSci", "Avalanche", "TypeScript"],
    award: "EIBS 2025 winner",
    github: "https://github.com/arko05roy/InnoFund",
  },
  {
    name: "Velto",
    image: "https://opengraph.githubassets.com/1/arko05roy/Velto",
    description: "An AI memory layer that carries your context across ChatGPT, Claude, Cursor and Copilot so you never re-explain a project.",
    tech: ["AI", "TypeScript"],
    github: "https://github.com/arko05roy/Velto",
  },
  {
    name: "Tzunami",
    image: "https://opengraph.githubassets.com/1/arko05roy/Tzunami-ETHGlobal",
    description: "A privacy-preserving, compliant finance platform combining Self.xyz zero-knowledge KYC on Celo with fhERC encrypted tokens.",
    tech: ["Circom", "Celo", "FHE", "ZK"],
    award: "1inch sponsor track winner",
    github: "https://github.com/arko05roy/Tzunami-ETHGlobal",
  },
  {
    name: "VeilX",
    image: "https://opengraph.githubassets.com/1/arko05roy/Veil-X",
    description: "Document redaction and locker combining ML (PaddleOCR, Llama 3.1) with smart contracts on Avalanche.",
    tech: ["ML", "Avalanche", "TypeScript"],
    award: "Hack Heritage winner",
    github: "https://github.com/arko05roy/Veil-X",
  },
  {
    name: "ZeedChain",
    logo: "/projects/zeedchain.svg",
    image: "/shots/zeed-chain-live-vercel-app.jpg",
    description: "Students list startups, complete KYC and raise funding for equity on EDUChain; investors receive NFT shares.",
    tech: ["EDUChain", "Solidity", "TypeScript"],
    award: "EDU Chain Regionals winner",
    live: "https://zeed-chain-live.vercel.app",
    github: "https://github.com/arko05roy/ZeedChain",
    status: "live",
  },
  {
    name: "Nebula",
    logo: "/projects/nebula.svg",
    image: "/shots/nebula-launch-vercel-app.jpg",
    description: "Landing page for Nebula Launchpad, a DeSci research curator platform.",
    tech: ["DeSci", "JavaScript"],
    live: "https://nebula-launch.vercel.app",
    github: "https://github.com/arko05roy/Nebula",
    status: "live",
  },
  {
    name: "Prosparity AI",
    image: "/shots/prosparity-ai-vercel-app.jpg",
    description: "An AI sales call assistant that helps sales teams engage leads and manage their pipeline.",
    tech: ["AI", "JavaScript"],
    live: "https://prosparity-ai.vercel.app",
    github: "https://github.com/arko05roy/Prosparity-AI",
    status: "live",
  },
];

export const achievements = [
  { event: "ETHGlobal New Delhi", note: "2000+ participants", result: "Bounty winner" },
  { event: "Solana Frontier Hackathon 2026", result: "Bounty winner" },
  { event: "Vibethon 2026", result: "Winner" },
  { event: "Build on CELO Kolkata", note: "100+ teams", result: "Winner" },
  { event: "Avalanche Team1 Kolkata", note: "100+ teams", result: "Winner" },
  { event: "Hack Heritage 2024", note: "1000+ participants", result: "Winner" },
  { event: "EIBS IIT KGP", result: "2nd place" },
  { event: "EDU Chain Regional", note: "100+ participants", result: "3rd place" },
];

export const skills = [
  "TypeScript", "JavaScript", "Solidity", "Rust", "Python", "C++", "React", "Next.js", "Node.js",
  "Tailwind", "shadcn/ui", "Foundry", "Hardhat", "Anchor", "OP Stack", "Noir", "PostgreSQL",
  "MongoDB", "Prisma", "Supabase", "Redis", "Docker", "Zustand", "Git",
];

// logo files in /public/logos/skills (Simple Icons, recoloured bone); skills without one get a monogram
export const skillIcons: Record<string, string> = {
  TypeScript: "typescript", JavaScript: "javascript", Solidity: "solidity", Rust: "rust", Python: "python",
  "C++": "cplusplus", React: "react", "Next.js": "nextdotjs", "Node.js": "nodedotjs", Tailwind: "tailwindcss",
  "shadcn/ui": "shadcnui", "OP Stack": "optimism", PostgreSQL: "postgresql", MongoDB: "mongodb", Prisma: "prisma",
  Supabase: "supabase", Redis: "redis", Docker: "docker", Git: "git",
};

export const uses: { category: string; items: { name: string; note: string }[] }[] = [
  { category: "Hardware", items: [{ name: "Laptop", note: "Your machine" }, { name: "Monitor", note: "Your display" }] },
  { category: "Software", items: [{ name: "VS Code", note: "Editor" }, { name: "Warp", note: "Terminal" }] },
  { category: "Services", items: [{ name: "Vercel", note: "Hosting" }, { name: "GitHub", note: "Code" }] },
];

export const resume = {
  pdfUrl: "/resume.pdf", // e.g. a Google Drive /preview link; leave empty to show a placeholder
  downloadUrl: profile.resumeUrl,
};

export const support = {
  message: "If you like my work, consider supporting it. Every bit helps me keep building.",
  links: [
    { label: "Buy me a coffee", url: "https://buymeacoffee.com/" },
    { label: "GitHub Sponsors", url: "https://github.com/sponsors/" },
  ],
};
