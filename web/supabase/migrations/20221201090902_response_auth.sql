-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.
CREATE
OR REPLACE FUNCTION public.response_has_access(
    this_accociated_request_id uuid,
    this_auth_hash text
) RETURNS boolean LANGUAGE 'sql' COST 100 VOLATILE PARALLEL UNSAFE AS $ BODY $
SELECT
    EXISTS (
        select
            *
        from
            request r
        where
            r.id = this_accociated_request_id
            and r.auth_hash = this_auth_hash
    ) $ BODY $;

ALTER FUNCTION public.response_has_access(uuid, text) OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.response_has_access(uuid, text) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.response_has_access(uuid, text) TO anon;

GRANT EXECUTE ON FUNCTION public.response_has_access(uuid, text) TO authenticated;

GRANT EXECUTE ON FUNCTION public.response_has_access(uuid, text) TO postgres;

GRANT EXECUTE ON FUNCTION public.response_has_access(uuid, text) TO service_role;

ALTER TABLE
    IF EXISTS public.request ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Select using auth token" ON public.request AS PERMISSIVE FOR
SELECT
    TO public USING (
        (
            (
                (current_setting('request.headers' :: text, true)) :: json ->> 'authhash' :: text
            ) = auth_hash
        )
    );

DROP POLICY IF EXISTS "Only Auth hash header can select request" ON public.request;

ALTER TABLE
    IF EXISTS public.response ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Does user have access to response using RBAC" ON public.response AS PERMISSIVE FOR
SELECT
    TO public USING (
        response_has_access(
            request,
            (
                (current_setting('request.headers' :: text, true)) :: json ->> 'authhash' :: text
            )
        )
    );