CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

CREATE TYPE public.verification_status AS ENUM ('verified','partial','pending','rejected');

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.colleges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  institution_type text NOT NULL CHECK (institution_type IN ('Institute of National Importance','Private University','Deemed University','Affiliated College')),
  ownership text NOT NULL DEFAULT 'Private' CHECK (ownership IN ('Government','Private')),
  area text,
  city text NOT NULL DEFAULT 'Jaipur',
  state text NOT NULL DEFAULT 'Rajasthan',
  established_year int CHECK (established_year BETWEEN 1800 AND 2100),
  affiliation text,
  website text,
  entrance_routes text[] NOT NULL DEFAULT '{}',
  summary text,
  latitude double precision,
  longitude double precision,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  last_verified_at timestamptz,
  search tsvector GENERATED ALWAYS AS (
    to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(area,'') || ' ' || coalesce(affiliation,'') || ' ' || coalesce(summary,''))
  ) STORED,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX colleges_search_idx ON public.colleges USING gin (search);
CREATE INDEX colleges_name_trgm_idx ON public.colleges USING gin (name extensions.gin_trgm_ops);
CREATE INDEX colleges_type_idx ON public.colleges (institution_type);
CREATE INDEX colleges_area_idx ON public.colleges (area);
CREATE INDEX colleges_verification_idx ON public.colleges (verification_status);
CREATE INDEX colleges_entrance_idx ON public.colleges USING gin (entrance_routes);
CREATE TRIGGER colleges_updated BEFORE UPDATE ON public.colleges FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.college_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  url text NOT NULL,
  title text,
  source_type text NOT NULL DEFAULT 'official_website' CHECK (source_type IN ('official_website','government','regulator','official_social','news','seed_list','other')),
  publisher text,
  notes text,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  accessed_at timestamptz,
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (college_id, url)
);
CREATE INDEX ON public.college_sources (college_id);
CREATE TRIGGER college_sources_updated BEFORE UPDATE ON public.college_sources FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.college_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  alias text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (college_id, alias)
);
CREATE INDEX college_aliases_trgm_idx ON public.college_aliases USING gin (alias extensions.gin_trgm_ops);

CREATE TABLE public.college_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  degree text NOT NULL,
  name text,
  department text,
  duration_years numeric(3,1),
  intake int,
  source_id uuid REFERENCES public.college_sources(id) ON DELETE SET NULL,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.college_programs (college_id);
CREATE INDEX ON public.college_programs (degree);

CREATE TABLE public.college_departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  url text,
  source_id uuid REFERENCES public.college_sources(id) ON DELETE SET NULL,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.college_departments (college_id);

CREATE TABLE public.college_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('hostel','transport','library','labs','sports','medical','dining','wifi','other')),
  name text NOT NULL,
  description text,
  source_id uuid REFERENCES public.college_sources(id) ON DELETE SET NULL,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.college_facilities (college_id);
CREATE INDEX ON public.college_facilities (category);

CREATE TABLE public.college_clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'technical' CHECK (category IN ('technical','cultural','sports','entrepreneurship','social','research','other')),
  description text,
  url text,
  source_id uuid REFERENCES public.college_sources(id) ON DELETE SET NULL,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.college_clubs (college_id);
CREATE INDEX ON public.college_clubs (category);

CREATE TABLE public.college_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  title text NOT NULL,
  year int,
  description text,
  source_id uuid REFERENCES public.college_sources(id) ON DELETE SET NULL,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.college_achievements (college_id);

CREATE TABLE public.college_research (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'centre' CHECK (kind IN ('centre','lab','incubator','publication','patent','project','other')),
  title text NOT NULL,
  area text,
  description text,
  url text,
  source_id uuid REFERENCES public.college_sources(id) ON DELETE SET NULL,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.college_research (college_id);

CREATE TABLE public.college_social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('instagram','linkedin','x','youtube','facebook','other')),
  url text NOT NULL,
  is_official boolean NOT NULL DEFAULT false,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (college_id, platform, url)
);

CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid REFERENCES public.colleges(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('hackathon','technical_fest','cultural_fest','workshop','competition','seminar','other')),
  description text,
  starts_at timestamptz,
  ends_at timestamptz,
  venue text,
  registration_url text,
  source_id uuid REFERENCES public.college_sources(id) ON DELETE SET NULL,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at IS NULL OR starts_at IS NULL OR ends_at >= starts_at)
);
CREATE INDEX ON public.events (college_id);
CREATE INDEX ON public.events (starts_at);
CREATE INDEX ON public.events (event_type);

CREATE TABLE public.college_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id uuid REFERENCES public.colleges(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  url text,
  published_at timestamptz,
  source_id uuid REFERENCES public.college_sources(id) ON DELETE SET NULL,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  last_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.college_updates (college_id);
CREATE INDEX ON public.college_updates (published_at DESC);

CREATE TABLE public.verification_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_table text NOT NULL,
  entity_id uuid NOT NULL,
  status public.verification_status NOT NULL,
  source_id uuid REFERENCES public.college_sources(id) ON DELETE SET NULL,
  notes text,
  verified_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.verification_log (entity_table, entity_id);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['college_programs','college_departments','college_facilities','college_clubs','college_achievements','college_research','college_social_links','events','college_updates'] LOOP
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.set_updated_at()', t || '_updated', t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['colleges','college_sources','college_aliases','college_programs','college_departments','college_facilities','college_clubs','college_achievements','college_research','college_social_links','events','college_updates','verification_log'] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon, authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    IF t IN ('college_aliases','verification_log') THEN
      EXECUTE format('CREATE POLICY "Public read" ON public.%I FOR SELECT TO anon, authenticated USING (true)', t);
    ELSE
      EXECUTE format('CREATE POLICY "Public read non-rejected" ON public.%I FOR SELECT TO anon, authenticated USING (verification_status <> ''rejected'')', t);
    END IF;
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.search_colleges(q text DEFAULT NULL, kind text DEFAULT NULL)
RETURNS SETOF public.colleges LANGUAGE sql STABLE SET search_path = public, extensions AS $$
  SELECT c.* FROM public.colleges c
  WHERE c.verification_status <> 'rejected'
    AND (kind IS NULL OR c.institution_type = kind)
    AND (
      q IS NULL OR q = ''
      OR c.search @@ plainto_tsquery('simple', q)
      OR c.name ILIKE '%' || q || '%'
      OR c.area ILIKE '%' || q || '%'
      OR EXISTS (SELECT 1 FROM public.college_aliases a WHERE a.college_id = c.id AND a.alias ILIKE '%' || q || '%')
      OR EXISTS (SELECT 1 FROM public.college_programs p WHERE p.college_id = c.id AND p.degree ILIKE '%' || q || '%')
      OR EXISTS (SELECT 1 FROM unnest(c.entrance_routes) e WHERE e ILIKE '%' || q || '%')
    )
  ORDER BY c.name;
$$;
GRANT EXECUTE ON FUNCTION public.search_colleges(text, text) TO anon, authenticated, service_role;

-- Seed: facts only for the 5 partially verified records
INSERT INTO public.colleges (slug,name,institution_type,ownership,area,established_year,website,entrance_routes,summary,verification_status) VALUES
('mnit-jaipur','Malaviya National Institute of Technology Jaipur','Institute of National Importance','Government','JLN Marg, Malviya Nagar',1963,'https://www.mnit.ac.in',ARRAY['JEE Main','JoSAA'],'One of the National Institutes of Technology, declared an Institute of National Importance under the NIT Act, 2007.','partial'),
('lnmiit','The LNM Institute of Information Technology','Deemed University','Private','Jamdoli, Agra Road',2002,'https://www.lnmiit.ac.in',ARRAY['JEE Main'],'Autonomous, not-for-profit deemed university focused on computing, communication and allied engineering.','partial'),
('manipal-university-jaipur','Manipal University Jaipur','Private University','Private','Dehmi Kalan, Ajmer Road',2011,'https://jaipur.manipal.edu',ARRAY['MET','JEE Main'],'State private university established under a Rajasthan Act, part of the Manipal education group.','partial'),
('jklu','JK Lakshmipat University','Private University','Private','Mahapura, Ajmer Road',2011,'https://jklu.edu.in','{}',NULL,'partial'),
('amity-rajasthan','Amity University Rajasthan','Private University','Private','Kant Kalwar, NH-11C',2008,'https://www.amity.edu/jaipur','{}',NULL,'partial');

-- Seed: name + type only, everything else pending verification
INSERT INTO public.colleges (slug,name,institution_type,verification_status) VALUES
('vgu','Vivekananda Global University','Private University','pending'),
('jecrc-university','JECRC University','Private University','pending'),
('poornima-university','Poornima University','Private University','pending'),
('sgvu','Suresh Gyan Vihar University','Private University','pending'),
('jnu-jaipur','Jaipur National University','Private University','pending'),
('uem-jaipur','University of Engineering & Management Jaipur','Private University','pending'),
('jagannath-university','Jagannath University Jaipur','Private University','pending'),
('apex-university','Apex University','Private University','pending'),
('nims','NIMS University Rajasthan','Private University','pending'),
('mvgu','Maharaj Vinayak Global University','Private University','pending'),
('jec','Jaipur Engineering College','Affiliated College','pending'),
('jecrc','Jaipur Engineering College & Research Centre','Affiliated College','pending'),
('jiet','Jaipur Institute of Engineering & Technology','Affiliated College','pending'),
('skit','Swami Keshvanand Institute of Technology, Management & Gramothan','Affiliated College','pending'),
('git','Global Institute of Technology','Affiliated College','pending'),
('gct','Global College of Technology','Affiliated College','pending'),
('pce','Poornima College of Engineering','Affiliated College','pending'),
('piet','Poornima Institute of Engineering & Technology','Affiliated College','pending'),
('aceit','Arya College of Engineering & IT','Affiliated College','pending'),
('aiet','Arya Institute of Engineering & Technology','Affiliated College','pending'),
('acerc','Arya College of Engineering & Research Centre','Affiliated College','pending'),
('sit','Shankara Institute of Technology','Affiliated College','pending'),
('riet','Rajasthan Institute of Engineering & Technology','Affiliated College','pending'),
('rcew','Rajasthan College of Engineering for Women','Affiliated College','pending'),
('rcert','Regional College for Education Research & Technology','Affiliated College','pending'),
('yit','Yagyavalkya Institute of Technology','Affiliated College','pending'),
('sbcet','Sri Balaji College of Engineering & Technology','Affiliated College','pending'),
('mgec','Mahatma Gandhi Engineering College','Affiliated College','pending'),
('kite','Kautilya Institute of Technology & Engineering','Affiliated College','pending'),
('macerc','Maharishi Arvind College of Engineering & Research Centre','Affiliated College','pending'),
('maiet','Maharishi Arvind Institute of Engineering & Technology','Affiliated College','pending'),
('aiet-apex','Apex Institute of Engineering & Technology','Affiliated College','pending'),
('mjrp','MJRP College of Engineering & Technology','Affiliated College','pending'),
('drit','Dr. Radhakrishnan Institute of Technology','Affiliated College','pending'),
('jit','Jaipur Institute of Technology Group of Institutions','Affiliated College','pending'),
('udml','Uttam Devi Mohan Lal College of Engineering','Affiliated College','pending');

INSERT INTO public.college_aliases (college_id, alias)
SELECT c.id, v.alias FROM (VALUES ('mnit-jaipur','MNIT Jaipur'),('lnmiit','LNMIIT'),('manipal-university-jaipur','MUJ'),('jklu','JKLU'),('skit','SKIT')) v(slug, alias)
JOIN public.colleges c ON c.slug = v.slug;

INSERT INTO public.college_sources (college_id,url,title,source_type,notes,verification_status)
SELECT id, website, 'Official website', 'official_website', 'Website recorded; page content still to be checked field by field.', 'partial' FROM public.colleges WHERE website IS NOT NULL;
INSERT INTO public.college_sources (college_id,url,title,source_type,notes,verification_status)
SELECT id, 'internal:campusatlas-brief-seed-list', 'CampusAtlas project brief — seed list', 'seed_list', 'Name only. Existence, current status, location and website not yet verified.', 'pending' FROM public.colleges WHERE website IS NULL;

INSERT INTO public.college_programs (college_id, degree, source_id, verification_status)
SELECT c.id, v.degree, s.id, 'partial'
FROM (VALUES
  ('mnit-jaipur','B.Tech'),('mnit-jaipur','B.Arch'),('mnit-jaipur','M.Tech'),('mnit-jaipur','MBA'),('mnit-jaipur','PhD'),
  ('lnmiit','B.Tech'),('lnmiit','M.Tech'),('lnmiit','PhD'),
  ('manipal-university-jaipur','B.Tech'),('manipal-university-jaipur','M.Tech'),('manipal-university-jaipur','PhD'),
  ('jklu','B.Tech'),('jklu','M.Tech'),
  ('amity-rajasthan','B.Tech'),('amity-rajasthan','M.Tech')
) v(slug, degree)
JOIN public.colleges c ON c.slug = v.slug
LEFT JOIN public.college_sources s ON s.college_id = c.id AND s.source_type = 'official_website';

INSERT INTO public.verification_log (entity_table, entity_id, status, notes)
SELECT 'colleges', id, verification_status, 'Initial import from CampusAtlas seed list' FROM public.colleges;