insert into storage.buckets (id, name, public)
values
  ('gallery-photos', 'gallery-photos', true),
  ('blog-covers', 'blog-covers', true),
  ('event-covers', 'event-covers', true),
  ('team-photos', 'team-photos', true)
on conflict (id) do nothing;
