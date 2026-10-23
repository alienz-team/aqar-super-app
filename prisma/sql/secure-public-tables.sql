-- Lock the Prisma tables away from Supabase's Data API (REST/GraphQL).
--
-- Prisma creates these tables in the `public` schema, which Supabase can expose to anyone
-- holding the publishable/anon key. The app never reads them that way: every query goes
-- through Prisma on the server, connected as the table owner, which RLS does not restrict.
-- So: enable RLS with no policies (deny all) and revoke the API roles' privileges outright.
-- Without this, a signed-in visitor could PATCH their own "User".role to 'ADMIN'.
--
-- Run after every `npm run db:push` that adds a table:  npm run db:secure

do $$
declare
  t text;
begin
  foreach t in array array['User', 'Property', 'Booking', 'ServiceRequest', 'MaterialPrice', 'Service'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated', t);
  end loop;
end
$$;
