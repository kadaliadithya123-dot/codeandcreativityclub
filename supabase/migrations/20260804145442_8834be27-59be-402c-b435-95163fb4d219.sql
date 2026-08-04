-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'faculty');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id);
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email), NEW.email)
  ON CONFLICT (id) DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM public.user_roles) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'faculty');
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Students
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hall_ticket TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  year TEXT NOT NULL,
  department TEXT NOT NULL,
  section TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students_staff_all" ON public.students FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER students_updated_at BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Questions
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT NOT NULL,
  department TEXT NOT NULL,
  section TEXT NOT NULL,
  subject TEXT NOT NULL,
  question TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A','B','C','D')),
  difficulty TEXT NOT NULL DEFAULT 'Medium',
  marks INTEGER NOT NULL DEFAULT 1,
  explanation TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.questions TO authenticated;
GRANT ALL ON public.questions TO service_role;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "questions_staff_all" ON public.questions FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER questions_updated_at BEFORE UPDATE ON public.questions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tests
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  year TEXT NOT NULL,
  department TEXT NOT NULL,
  section TEXT NOT NULL,
  subject TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  question_count INTEGER NOT NULL DEFAULT 10,
  shuffle_questions BOOLEAN NOT NULL DEFAULT true,
  shuffle_options BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','disabled')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tests TO authenticated;
GRANT ALL ON public.tests TO service_role;
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tests_staff_all" ON public.tests FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER tests_updated_at BEFORE UPDATE ON public.tests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Results
CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_marks INTEGER NOT NULL DEFAULT 0,
  percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  wrong INTEGER NOT NULL DEFAULT 0,
  time_taken_seconds INTEGER NOT NULL DEFAULT 0,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, test_id)
);
GRANT SELECT, UPDATE, DELETE ON public.results TO authenticated;
GRANT ALL ON public.results TO service_role;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "results_staff_all" ON public.results FOR ALL TO authenticated
USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE INDEX idx_questions_scope ON public.questions (year, department, section);
CREATE INDEX idx_tests_scope ON public.tests (year, department, section, status);
CREATE INDEX idx_results_test ON public.results (test_id);

-- Demo data
INSERT INTO public.students (hall_ticket, name, year, department, section) VALUES
 ('22CM1A0101','Aarav Reddy','Second Year','CME','C'),
 ('22CM1A0102','Divya Sharma','Second Year','CME','C'),
 ('22CM1A0103','Karthik Rao','Second Year','CME','C'),
 ('22CS1A0201','Sneha Patel','First Year','CSE','A'),
 ('22EC1A0301','Rahul Verma','Final Year','ECE','B');

INSERT INTO public.tests (title, year, department, section, subject, duration_minutes, question_count, status) VALUES
 ('Python Fundamentals Quiz','Second Year','CME','C','Python',20,5,'published'),
 ('C Programming Basics','First Year','CSE','A','C Programming',15,5,'published'),
 ('Data Structures Assessment','Final Year','ECE','B','Data Structures',25,5,'draft');

INSERT INTO public.questions (year, department, section, subject, question, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
 ('Second Year','CME','C','Python','Which keyword defines a function in Python?','func','def','function','lambda','B','Easy',1,'Python uses def to define a named function.'),
 ('Second Year','CME','C','Python','What is the output of len("coding")?','5','6','7','Error','B','Easy',1,'"coding" has 6 characters.'),
 ('Second Year','CME','C','Python','Which data type is immutable?','list','dict','set','tuple','D','Medium',1,'Tuples cannot be modified after creation.'),
 ('Second Year','CME','C','Python','What does the // operator do?','Comment','Float division','Floor division','Exponent','C','Medium',1,'// performs floor division.'),
 ('Second Year','CME','C','Python','Which module is used for regular expressions?','regex','re','rex','pyre','B','Hard',2,'The standard library module is re.'),
 ('First Year','CSE','A','C Programming','Which header is needed for printf?','stdlib.h','stdio.h','string.h','math.h','B','Easy',1,'printf is declared in stdio.h.'),
 ('First Year','CSE','A','C Programming','Size of int on most 32-bit systems?','2 bytes','4 bytes','8 bytes','1 byte','B','Easy',1,'Typically 4 bytes.'),
 ('First Year','CSE','A','C Programming','Which loop always executes at least once?','for','while','do-while','none','C','Medium',1,'do-while checks the condition after the body.'),
 ('First Year','CSE','A','C Programming','What does & mean before a variable?','Value of','Address of','Pointer to','Logical and','B','Medium',1,'& is the address-of operator.'),
 ('First Year','CSE','A','C Programming','Which is a valid variable name?','2var','var 2','_var2','var-2','C','Easy',1,'Names may start with a letter or underscore.'),
 ('Final Year','ECE','B','Data Structures','Which structure uses FIFO?','Stack','Queue','Tree','Graph','B','Easy',1,'A queue is first in, first out.'),
 ('Final Year','ECE','B','Data Structures','Time complexity of binary search?','O(n)','O(log n)','O(n log n)','O(1)','B','Medium',1,'Binary search halves the range each step.'),
 ('Final Year','ECE','B','Data Structures','Which traversal visits root first?','Inorder','Preorder','Postorder','Level order','B','Medium',1,'Preorder is root, left, right.'),
 ('Final Year','ECE','B','Data Structures','Worst case of quicksort?','O(n)','O(n log n)','O(n^2)','O(log n)','C','Hard',2,'Poor pivots degrade quicksort to O(n^2).'),
 ('Final Year','ECE','B','Data Structures','Hash table average lookup time?','O(1)','O(n)','O(log n)','O(n^2)','A','Medium',1,'Average constant time with good hashing.');

INSERT INTO public.results (student_id, test_id, score, total_marks, percentage, correct, wrong, time_taken_seconds)
SELECT s.id, t.id, 5, 6, 83.33, 4, 1, 640
FROM public.students s, public.tests t
WHERE s.hall_ticket = '22CM1A0101' AND t.title = 'Python Fundamentals Quiz';

INSERT INTO public.results (student_id, test_id, score, total_marks, percentage, correct, wrong, time_taken_seconds)
SELECT s.id, t.id, 3, 6, 50.00, 3, 2, 720
FROM public.students s, public.tests t
WHERE s.hall_ticket = '22CM1A0102' AND t.title = 'Python Fundamentals Quiz';

INSERT INTO public.results (student_id, test_id, score, total_marks, percentage, correct, wrong, time_taken_seconds)
SELECT s.id, t.id, 5, 5, 100.00, 5, 0, 400
FROM public.students s, public.tests t
WHERE s.hall_ticket = '22CS1A0201' AND t.title = 'C Programming Basics';