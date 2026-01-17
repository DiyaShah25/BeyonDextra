-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a more restrictive policy: users can view their own profile
-- or profiles of users enrolled in the same courses as them
CREATE POLICY "Users can view own profile or course peers"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.enrollments e1
    JOIN public.enrollments e2 ON e1.course_id = e2.course_id
    WHERE e1.user_id = auth.uid()
    AND e2.user_id = profiles.user_id
  )
  OR has_role(auth.uid(), 'admin')
  OR has_role(auth.uid(), 'instructor')
);