// Client-safe types and labels. Data lives in Lovable Cloud — see colleges.functions.ts.
export type Verification = "verified" | "partial" | "pending" | "rejected";

export type CollegeType = "Institute of National Importance" | "Private University" | "Deemed University" | "Affiliated College";

export interface Source {
  id: string;
  url: string;
  title: string | null;
  sourceType: string;
  notes: string | null;
  verification: Verification;
  lastVerifiedAt: string | null;
}

export interface College {
  id: string;
  slug: string;
  name: string;
  aliases: string[];
  type: CollegeType;
  ownership: "Government" | "Private";
  area: string | null;
  established: number | null;
  affiliation: string | null;
  website: string | null;
  entrance: string[];
  programs: string[];
  summary: string | null;
  verification: Verification;
  lastVerifiedAt: string | null;
  updatedAt: string;
}

export interface CollegeDetail extends College {
  sources: Source[];
  facilities: { id: string; category: string; name: string; description: string | null; verification: Verification }[];
  clubs: { id: string; category: string; name: string; description: string | null; url: string | null; verification: Verification }[];
  socials: { id: string; platform: string; url: string; verification: Verification }[];
}

export const collegeTypes: CollegeType[] = ["Institute of National Importance", "Private University", "Deemed University", "Affiliated College"];

export const verificationLabel: Record<Verification, string> = {
  verified: "Verified",
  partial: "Partially verified",
  pending: "Verification pending",
  rejected: "Rejected",
};
