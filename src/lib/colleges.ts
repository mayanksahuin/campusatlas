export type Verification = "verified" | "partial" | "pending";

export interface College {
  slug: string;
  name: string;
  aliases?: string[] | undefined;
  type: "Institute of National Importance" | "Private University" | "Deemed University" | "Affiliated College";
  ownership: "Government" | "Private";
  area: string;
  established?: number;
  affiliation?: string | undefined;
  website?: string;
  entrance?: string[];
  programs?: string[];
  summary?: string;
  verification: Verification;
}

const pending = (slug: string, name: string, area: string, type: College["type"] = "Affiliated College", aliases?: string[]): College => ({
  slug, name, area, type, ownership: "Private", verification: "pending", aliases,
  affiliation: type === "Affiliated College" ? "Rajasthan Technical University (to verify)" : undefined,
});

export const colleges: College[] = [
  {
    slug: "mnit-jaipur", name: "Malaviya National Institute of Technology Jaipur", aliases: ["MNIT Jaipur"],
    type: "Institute of National Importance", ownership: "Government", area: "JLN Marg, Malviya Nagar",
    established: 1963, website: "https://www.mnit.ac.in", entrance: ["JEE Main", "JoSAA"],
    programs: ["B.Tech", "B.Arch", "M.Tech", "MBA", "PhD"],
    summary: "One of the National Institutes of Technology, declared an Institute of National Importance under the NIT Act, 2007.",
    verification: "partial",
  },
  {
    slug: "lnmiit", name: "The LNM Institute of Information Technology", aliases: ["LNMIIT"],
    type: "Deemed University", ownership: "Private", area: "Jamdoli, Agra Road",
    established: 2002, website: "https://www.lnmiit.ac.in", entrance: ["JEE Main"],
    programs: ["B.Tech", "M.Tech", "PhD"],
    summary: "Autonomous, not-for-profit deemed university focused on computing, communication and allied engineering.",
    verification: "partial",
  },
  {
    slug: "manipal-university-jaipur", name: "Manipal University Jaipur", aliases: ["MUJ"],
    type: "Private University", ownership: "Private", area: "Dehmi Kalan, Ajmer Road",
    established: 2011, website: "https://jaipur.manipal.edu", entrance: ["MET", "JEE Main"],
    programs: ["B.Tech", "M.Tech", "PhD"],
    summary: "State private university established under a Rajasthan Act, part of the Manipal education group.",
    verification: "partial",
  },
  {
    slug: "jklu", name: "JK Lakshmipat University", aliases: ["JKLU"],
    type: "Private University", ownership: "Private", area: "Mahapura, Ajmer Road",
    established: 2011, website: "https://jklu.edu.in", programs: ["B.Tech", "M.Tech"], verification: "partial",
  },
  {
    slug: "amity-rajasthan", name: "Amity University Rajasthan",
    type: "Private University", ownership: "Private", area: "Kant Kalwar, NH-11C",
    established: 2008, website: "https://www.amity.edu/jaipur", programs: ["B.Tech", "M.Tech"], verification: "partial",
  },
  pending("vgu", "Vivekananda Global University", "Sector 36, Sisyawas", "Private University"),
  pending("jecrc-university", "JECRC University", "Sitapura", "Private University"),
  pending("poornima-university", "Poornima University", "Sitapura", "Private University"),
  pending("sgvu", "Suresh Gyan Vihar University", "Jagatpura", "Private University"),
  pending("jnu-jaipur", "Jaipur National University", "Jagatpura", "Private University"),
  pending("uem-jaipur", "University of Engineering & Management Jaipur", "Sikar Road", "Private University"),
  pending("jagannath-university", "Jagannath University Jaipur", "Chaksu", "Private University"),
  pending("apex-university", "Apex University", "Achrol", "Private University"),
  pending("nims", "NIMS University Rajasthan", "Shobha Nagar, Delhi Road", "Private University"),
  pending("mvgu", "Maharaj Vinayak Global University", "Dhand, Amer", "Private University"),
  pending("jec", "Jaipur Engineering College", "Kukas"),
  pending("jecrc", "Jaipur Engineering College & Research Centre", "Sitapura"),
  pending("jiet", "Jaipur Institute of Engineering & Technology", "Kukas"),
  pending("skit", "Swami Keshvanand Institute of Technology, Management & Gramothan", "Jagatpura", "Affiliated College", ["SKIT"]),
  pending("git", "Global Institute of Technology", "Sitapura"),
  pending("gct", "Global College of Technology", "Sitapura"),
  pending("pce", "Poornima College of Engineering", "Sitapura"),
  pending("piet", "Poornima Institute of Engineering & Technology", "Sitapura"),
  pending("aceit", "Arya College of Engineering & IT", "Kukas"),
  pending("aiet", "Arya Institute of Engineering & Technology", "Kukas"),
  pending("acerc", "Arya College of Engineering & Research Centre", "Kukas"),
  pending("sit", "Shankara Institute of Technology", "Kukas"),
  pending("riet", "Rajasthan Institute of Engineering & Technology", "Bhankrota"),
  pending("rcew", "Rajasthan College of Engineering for Women", "Bhankrota"),
  pending("rcert", "Regional College for Education Research & Technology", "Sitapura"),
  pending("yit", "Yagyavalkya Institute of Technology", "Sitapura"),
  pending("sbcet", "Sri Balaji College of Engineering & Technology", "Benad Road"),
  pending("mgec", "Mahatma Gandhi Engineering College", "Sitapura"),
  pending("kite", "Kautilya Institute of Technology & Engineering", "Sitapura"),
  pending("macerc", "Maharishi Arvind College of Engineering & Research Centre", "Sirsi Road"),
  pending("maiet", "Maharishi Arvind Institute of Engineering & Technology", "Mansarovar"),
  pending("aiet-apex", "Apex Institute of Engineering & Technology", "Sitapura"),
  pending("mjrp", "MJRP College of Engineering & Technology", "Achrol"),
  pending("drit", "Dr. Radhakrishnan Institute of Technology", "Jaipur"),
  pending("jit", "Jaipur Institute of Technology Group of Institutions", "Jaipur"),
  pending("udml", "Uttam Devi Mohan Lal College of Engineering", "Jaipur"),
];

export const getCollege = (slug: string) => colleges.find((c) => c.slug === slug);

export const verificationLabel: Record<Verification, string> = {
  verified: "Verified",
  partial: "Partially verified",
  pending: "Verification pending",
};
