import type { RagChunk } from "./types";

type PortfolioData = {
  profile?: {
    role?: string;
    headline?: string;
    summary?: string;
    location?: string;
    contact?: Record<string, string>;
  };
  strengths?: string[];
  education?: Array<Record<string, unknown>>;
  experience?: Array<Record<string, unknown>>;
  projects?: Array<Record<string, unknown>>;
  certifications?: Array<Record<string, unknown>>;
  honorsAndAwards?: Array<Record<string, unknown>>;
  portfolioAssistant?: Record<string, unknown>;
  aiSystemsLab?: Record<string, unknown>;
  answeringRules?: string[];
};

const MAX_CHUNK_TEXT_CHARS = 7000;

export function buildRagChunks(context: string): RagChunk[] {
  const data = parsePortfolioData(context);
  const chunks: RagChunk[] = [];

  if (data.profile) {
    chunks.push({
      id: "profile",
      title: "Profile and contact",
      source: "Profile",
      category: "Profile",
      url: "/about/",
      text: cleanText([
        field("Role", data.profile.role),
        field("Headline", data.profile.headline),
        field("Location", data.profile.location),
        data.profile.summary,
        data.profile.contact ? `Contact: ${formatRecord(data.profile.contact)}` : ""
      ])
    });
  }

  if (data.strengths?.length) {
    chunks.push({
      id: "strengths",
      title: "Skills and strengths",
      source: "Skills",
      category: "Skills",
      url: "/about/",
      text: `Strengths:\n${formatList(data.strengths)}`
    });
  }

  for (const item of data.education || []) {
    const title = stringValue(item.degree) || "Education";
    chunks.push({
      id: makeChunkId("education", title),
      title,
      source: title,
      category: "Education",
      url: "/about/#education",
      text: recordToText(item, [
        "degree",
        "institution",
        "period",
        "status",
        "subjectCombination",
        "notes",
        "activities"
      ])
    });
  }

  for (const item of data.experience || []) {
    const role = stringValue(item.role) || "Experience";
    const organization = stringValue(item.organization);
    const title = organization ? `${role} at ${organization}` : role;
    chunks.push({
      id: makeChunkId("experience", title),
      title,
      source: title,
      category: "Experience",
      url: "/experience/",
      text: recordToText(item, [
        "role",
        "organization",
        "employmentType",
        "period",
        "duration",
        "location",
        "workMode",
        "summary",
        "skills"
      ])
    });
  }

  for (const item of data.projects || []) {
    const title = stringValue(item.title) || "Project";
    chunks.push({
      id: makeChunkId("project", title),
      title,
      source: title,
      category: "Projects",
      url: stringValue(item.link) || "/projects/",
      text: recordToText(item, [
        "title",
        "type",
        "summary",
        "areas",
        "stack",
        "metrics",
        "link",
        "limitations"
      ])
    });
  }

  for (const item of data.certifications || []) {
    const title = stringValue(item.title) || "Certification";
    chunks.push({
      id: makeChunkId("certification", title),
      title,
      source: title,
      category: "Certifications",
      url: stringValue(item.credentialUrl) || "/certifications/",
      text: recordToText(item, [
        "title",
        "issuer",
        "issued",
        "credentialId",
        "credentialUrl",
        "skills"
      ])
    });
  }

  if (data.portfolioAssistant) {
    chunks.push({
      id: "portfolio-assistant",
      title: "AI Portfolio Assistant with RAG and Vector Search",
      source: "AI Portfolio Assistant",
      category: "AI Systems",
      url: "/projects/",
      text: recordToText(data.portfolioAssistant, [
        "name",
        "status",
        "shortAnswer",
        "architecture",
        "knowledgeFile",
        "technologies",
        "whatItDemonstrates",
        "skillsVisualized",
        "honestyNote"
      ])
    });
  }

  if (data.aiSystemsLab) {
    chunks.push({
      id: "ai-systems-lab",
      title: "Local RAG learning notes",
      source: "Portfolio RAG implementation",
      category: "AI Systems",
      url: "/projects/",
      text: recordToText(data.aiSystemsLab, [
        "status",
        "path",
        "purpose",
        "currentMilestone",
        "flow",
        "tools",
        "nextSteps",
        "honestyNote"
      ])
    });
  }

  for (const item of data.honorsAndAwards || []) {
    const title = stringValue(item.title) || "Honor or award";
    chunks.push({
      id: makeChunkId("honor", title),
      title,
      source: title,
      category: "Honors",
      url: "/certifications/",
      text: recordToText(item, ["title", "issuer", "issued", "summary", "associatedWith"])
    });
  }

  if (data.answeringRules?.length) {
    chunks.push({
      id: "answering-rules",
      title: "Answering rules",
      source: "Portfolio answering rules",
      category: "AI Systems",
      url: "/projects/",
      text: `Rules:\n${formatList(data.answeringRules)}`
    });
  }

  return chunks.length > 0
    ? chunks
    : [
        {
          id: "portfolio-context",
          title: "Portfolio context",
          source: "Portfolio",
          category: "Portfolio",
          text: context.slice(0, MAX_CHUNK_TEXT_CHARS)
        }
      ];
}

function parsePortfolioData(context: string): PortfolioData {
  try {
    const parsed: unknown = JSON.parse(context);
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function recordToText(record: Record<string, unknown>, keys: string[]): string {
  return cleanText(
    keys.map((key) => {
      const value = record[key];
      if (value === undefined || value === null || value === "") {
        return "";
      }

      return `${humanizeKey(key)}: ${formatValue(value)}`;
    })
  );
}

function formatValue(value: unknown): string {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map(formatValue).filter(Boolean).join(", ");
  }

  if (isRecord(value)) {
    return Object.entries(value)
      .map(([key, nestedValue]) => `${humanizeKey(key)}: ${formatValue(nestedValue)}`)
      .join("; ");
  }

  return "";
}

function field(label: string, value?: string): string {
  return value ? `${label}: ${value}` : "";
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function formatRecord(record: Record<string, string>): string {
  return Object.entries(record)
    .map(([key, value]) => `${humanizeKey(key)}: ${value}`)
    .join("; ");
}

function formatList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function cleanText(parts: Array<string | undefined>): string {
  return parts
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))
    .join("\n")
    .slice(0, MAX_CHUNK_TEXT_CHARS);
}

function humanizeKey(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 42);
}

function makeChunkId(prefix: string, title: string): string {
  const slug = slugify(title) || "item";
  return `${prefix}-${slug}-${shortHash(title)}`;
}

function shortHash(value: string): string {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }

  return (hash >>> 0).toString(36).slice(0, 6);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
