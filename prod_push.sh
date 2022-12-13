
cd web
supabase link --project-ref bolqqmqbrciybnypvklh
supabase db push

cd ../worker
wrangler publish --env production

