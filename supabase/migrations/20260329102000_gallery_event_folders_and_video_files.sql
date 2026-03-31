create table if not exists gallery_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  cover_image_url text,
  event_id uuid references events(id) on delete set null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_gallery_folders_updated_at on gallery_folders;
create trigger trg_gallery_folders_updated_at
before update on gallery_folders
for each row execute procedure set_updated_at();

alter table gallery_photos
  add column if not exists folder_id uuid references gallery_folders(id) on delete set null;

alter table gallery_videos
  add column if not exists folder_id uuid references gallery_folders(id) on delete set null,
  add column if not exists source_type text not null default 'youtube',
  add column if not exists video_url text;

alter table gallery_videos
  alter column youtube_url drop not null;

create index if not exists idx_gallery_folders_event_id on gallery_folders(event_id);
create index if not exists idx_gallery_folders_slug on gallery_folders(slug);
create index if not exists idx_gallery_photos_folder_id on gallery_photos(folder_id);
create index if not exists idx_gallery_videos_folder_id on gallery_videos(folder_id);

insert into storage.buckets (id, name, public)
values ('gallery-videos', 'gallery-videos', true)
on conflict (id) do nothing;
