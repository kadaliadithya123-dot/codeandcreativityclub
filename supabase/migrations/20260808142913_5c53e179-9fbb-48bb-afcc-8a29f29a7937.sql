-- ============ site_content ============
CREATE TABLE public.site_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY site_content_public_read ON public.site_content
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY site_content_staff_write ON public.site_content
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::app_role,'faculty'::app_role)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::app_role,'faculty'::app_role)));

CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ club_events ============
CREATE TABLE public.club_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  kind text NOT NULL DEFAULT '',
  event_date text NOT NULL DEFAULT '',
  event_time text NOT NULL DEFAULT '',
  venue text NOT NULL DEFAULT '',
  audience text NOT NULL DEFAULT '',
  resource_persons jsonb NOT NULL DEFAULT '[]'::jsonb,
  highlights jsonb NOT NULL DEFAULT '[]'::jsonb,
  summary jsonb NOT NULL DEFAULT '[]'::jsonb,
  poster_url text,
  photos jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.club_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.club_events TO authenticated;
GRANT ALL ON public.club_events TO service_role;

ALTER TABLE public.club_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY club_events_public_read ON public.club_events
  FOR SELECT TO anon, authenticated USING (published = true);

CREATE POLICY club_events_staff_all ON public.club_events
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::app_role,'faculty'::app_role)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::app_role,'faculty'::app_role)));

CREATE TRIGGER club_events_updated_at BEFORE UPDATE ON public.club_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ club_members ============
CREATE TABLE public.club_members (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  role_title text NOT NULL DEFAULT 'Member',
  name text NOT NULL,
  pin text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  photo_url text,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.club_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.club_members TO authenticated;
GRANT ALL ON public.club_members TO service_role;

ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY club_members_public_read ON public.club_members
  FOR SELECT TO anon, authenticated USING (published = true);

CREATE POLICY club_members_staff_all ON public.club_members
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::app_role,'faculty'::app_role)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role IN ('admin'::app_role,'faculty'::app_role)));

CREATE TRIGGER club_members_updated_at BEFORE UPDATE ON public.club_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ seed: site_content ============
INSERT INTO public.site_content (key, value) VALUES
('club_info', '{
  "college": "Smt. B. Seetha Polytechnic",
  "campus": "Vishnupur, Bhimavaram",
  "society": "Shri Vishnu Educational Society",
  "centre": "Vishnu Student Success Centre",
  "name": "Code & Creative Club",
  "academicYear": "2025-2026",
  "tagline": "You dream it, we''ll create it",
  "posterUrl": "/__l5e/assets-v1/06a8fd2b-68ef-42ca-b287-1754756dda68/club-p1.jpg",
  "mission": "To engage students in national and international hackathons, coding events and appathons, thereby enhancing their technical skills and problem-solving capabilities. The club makes the college environment more creative and interesting, and builds a platform that motivates students to take part in technical activities marked by creativity, originality and innovative ideas.",
  "goal": "The Code and Creative Club aims to inspire students to develop coding and creative skills through collaboration, hands-on projects and innovation, preparing them for future tech careers.",
  "objectives": ["Increase coding literacy across every branch","Create logical thinking among the students","Develop skills that lead to campus placements","Remove code phobia","Incubate an environment for skilled developers"],
  "activities": ["Workshop on the basics of coding","Make a simple animation","Build an interactive website","Make a simple game","Coding awareness programs","Techfests and hackathon programs"]
}'::jsonb),
('hero', '{
  "badge": "Diploma coding assessments, done properly",
  "headingLead": "Run coding quizzes your",
  "headingAccent": "students can trust",
  "subheading": "Code&Creativity gives faculty one place to author question banks, publish tests to a specific year, branch and section, and read the results the minute the timer stops.",
  "primaryCtaLabel": "Start Test",
  "secondaryCtaLabel": "Faculty Login",
  "stats": [{"value":"6","label":"Departments"},{"value":"3","label":"Academic years"},{"value":"4","label":"Sections each"}],
  "aboutHeading": "About the portal",
  "aboutParagraphs": ["Built for polytechnic and diploma programmes, Code&Creativity replaces scattered spreadsheets and paper quizzes with a single workflow. Faculty maintain a question bank tagged by year, department, section, subject and difficulty, then publish it as a timed test.","Students never need an account. They pick their academic details, enter their hall ticket, and the system loads only the paper assigned to them."],
  "aboutSteps": ["Faculty author and tag questions","A test is published to a year, branch and section","Students verify their details and attempt it once","Scores and analytics appear instantly for faculty"]
}'::jsonb),
('exam_steps', '{
  "heading": "Steps to write an exam",
  "intro": "Follow these six steps to attempt your coding test without any confusion.",
  "items": [
    {"title":"Step 1 — Open Start Test","body":"Tap Start Test on the home page to open the exam entry form."},
    {"title":"Step 2 — Pick your class","body":"Choose your academic year, then your department (branch), then your section."},
    {"title":"Step 3 — Confirm your details","body":"Enter your full name and hall ticket number exactly as printed, then press Continue."},
    {"title":"Step 4 — Watch the timer","body":"The countdown starts as soon as the paper loads. Use the question palette to move around."},
    {"title":"Step 5 — Answer every question","body":"Each answer is saved automatically, so you can revisit and change it before submitting."},
    {"title":"Step 6 — Submit and see your score","body":"Press Submit (or let the timer end) and your score appears instantly on the result page."}
  ]
}'::jsonb),
('calendar', '{
  "heading": "Monthly calendar 2025-2026",
  "intro": "Events planned and conducted by the club for the academic year 2025-2026.",
  "rows": [
    {"event":"Career Guidance","date":"05-07-2025","day":"Monday"},
    {"event":"Cyber Shield O","date":"29-08-2025 & 30-08-2025","day":"Friday & Saturday"},
    {"event":"Engineer''s Day","date":"22-09-2025","day":"Monday"},
    {"event":"Skill Hour on Latest Technologies","date":"17-09-2025","day":"Wednesday"},
    {"event":"DBMS Basic Development Program (MongoDB)","date":"15-10-2025","day":"Wednesday"}
  ]
}'::jsonb);

-- ============ seed: club_events ============
INSERT INTO public.club_events (title, kind, event_date, event_time, venue, audience, resource_persons, highlights, summary, poster_url, photos, sort_order) VALUES
('Career Guidance','One day workshop','05 July 2025','10:00 AM – 1:30 PM','Colloquium','II year Computer Science & Engineering students',
 '["T. Sai Veera Narendra — Software Engineer, Lloyd (Banking Sector)"]'::jsonb,
 '["Exploring career options","Career planning strategies","Developing skills for the job market"]'::jsonb,
 '["The Career Guidance program was conducted on 05-07-2025 from 10:00 AM to 1:30 PM for the II year students of the Computer Science and Engineering department. The half-day session was organised by the department with the objective of guiding students toward a successful career in the IT field.","Mr. T. Sai Veera Narendra, Software Engineer, delivered an informative and motivating session on the future of IT, explaining career opportunities, emerging technologies and the skills required to succeed in the software industry.","Students participated actively and gained valuable insights into career planning and future opportunities in the IT sector."]'::jsonb,
 '/__l5e/assets-v1/a3c7a6ba-6903-454d-8dfb-969ee22bd75d/club-p5.jpg',
 '[{"url":"/__l5e/assets-v1/78c560ca-e001-4b73-b4d4-54f492e709b4/club-p6.jpg","alt":"Career Guidance session in the college colloquium"}]'::jsonb, 1),
('Cyber Shield O','Two day workshop','29 & 30 August 2025','9:00 AM – 12:30 PM','Colloquium','II year students',
 '["M. Prasad — Associate Professor","B. V. Prasanthi — Assistant Professor"]'::jsonb,
 '["Fundamentals of cybersecurity","Common cyber attacks","Preventive measures","Ethical behaviour online"]'::jsonb,
 '["The Cyber Shield seminar was conducted on 29th and 30th August 2025 at the Colloquium to build students'' awareness of cybersecurity fundamentals, common cyber attacks and the importance of ethical behaviour in the digital world.","Participants learned basic cybersecurity concepts, different types of cyber attacks and preventive measures to stay safe online, with an emphasis on being a responsible and ethical user of technology.","The session was delivered by M. Prasad and B. V. Prasanthi, who shared practical examples that improved students'' understanding of cyber safety practices."]'::jsonb,
 '/__l5e/assets-v1/c2de7d8a-5af0-48fb-88e8-f640af11cc30/club-p7.jpg',
 '[{"url":"/__l5e/assets-v1/9bd85aa6-f188-43ec-9564-4d2dc27ebd96/club-p8.jpg","alt":"Cyber Shield cybersecurity seminar in progress"}]'::jsonb, 2),
('Engineer''s Day 2025','Technical event — organised by DCME department','22 September 2025','9:00 AM – 4:30 PM','Seminar Hall','II year CME students',
 '["B. Vijaya Kumari — HOD, DCME (Secretary)","K. D. M. Mahima — Lecturer, DCME (Coordinator)"]'::jsonb,
 '["Quiz","Poster presentations","Web development"]'::jsonb,
 '["The Engineers'' Day event was conducted for II year CME students and included a quiz, poster presentations and website development activities.","Students presented posters on different engineering topics — artificial intelligence, AR/VR and cloud computing — and built simple websites, improving their creativity, technical knowledge and presentation skills.","The event encouraged students to share ideas, work as a team and gain practical experience."]'::jsonb,
 '/__l5e/assets-v1/6eba4f72-63bf-4dd0-aa37-566870bbb045/club-p9.jpg',
 '[{"url":"/__l5e/assets-v1/29f57c3d-38e4-4590-bac4-8589edbf6021/club-p10.jpg","alt":"Students presenting web development projects on Engineer''s Day"},{"url":"/__l5e/assets-v1/b761af3c-d998-4824-bec3-55cb0033f523/club-p11.jpg","alt":"Students presenting technology posters on Engineer''s Day"}]'::jsonb, 3),
('Skill Hour on Latest Technologies','Skill hour','17 September 2025','1:00 PM – 3:30 PM','Colloquium','Diploma students of the DCME department',
 '["Mrs. Vijaya Kumari — HOD, DCME (Secretary)"]'::jsonb,
 '["Overview of emerging technologies","Real-world applications","Skill enhancement for careers","Current industry requirements"]'::jsonb,
 '["The Skill Hour on Latest Technologies created awareness among students about emerging trends in computer engineering, explained in a simple and effective manner.","The session covered modern technological developments, real-time applications and the importance of skill enhancement for future careers.","Students gained useful knowledge about current industry requirements and career opportunities, improving their technical awareness and confidence."]'::jsonb,
 '/__l5e/assets-v1/01cc74c4-1797-4878-ac99-89f951a9176b/club-p14.jpg',
 '[{"url":"/__l5e/assets-v1/78da5fba-d34d-4e8c-819a-ad44051a6f40/club-p15.jpg","alt":"Resource person presenting during the Skill Hour session"},{"url":"/__l5e/assets-v1/5011652e-ae1e-4301-ba59-e5a6dddbc0e9/club-p16.jpg","alt":"Students attending the Skill Hour on Latest Technologies"}]'::jsonb, 4),
('Introduction to MongoDB','DBMS basic development program','15 October 2025','9:00 AM – 12:30 PM','Seminar Hall','Diploma students of the DCME department',
 '["Mrs. Vijaya Kumari — HOD, DCME (Secretary)"]'::jsonb,
 '["Introduction to database management systems","Features of MongoDB & document-based storage","CRUD operations in MongoDB","Real-world applications of MongoDB"]'::jsonb,
 '["The Introduction to MongoDB program familiarised students with modern database technologies and NoSQL concepts, focusing on MongoDB, which is widely used to handle large volumes of data.","Faculty explained the basics of database management systems and introduced MongoDB simply and effectively.","Topics such as features of MongoDB, document-based storage, collections and basic CRUD operations were discussed clearly, making them easy for students to understand."]'::jsonb,
 '/__l5e/assets-v1/a3a81716-ef32-40de-b45e-219623ea3001/club-p12.jpg',
 '[{"url":"/__l5e/assets-v1/edf66e06-7b2b-419c-afe6-71004fa59998/club-p13.jpg","alt":"Faculty explaining MongoDB read operations in the seminar hall"}]'::jsonb, 5);

-- ============ seed: club_members ============
INSERT INTO public.club_members (role_title, name, pin, email, phone, featured, sort_order) VALUES
('President','K. Adithya Sri Krishna','24093-CM-100','kadaliadithya123@gmail.com','9705945589', true, 1),
('Vice President','G. Manohar','24093-CM-070','garapatimanohar4074@gmail.com','9573643625', false, 2),
('Treasurer','Manchala Ganesh Vijay Kumar','23093-CM-083','ganeshmanchala1437@gmail.com','8332084493', false, 3),
('Secretary','Uppuganti Gayatri Naga Anusha','24093-CM-228','gayatriuppuganti08@gmail.com','9182852690', false, 4);