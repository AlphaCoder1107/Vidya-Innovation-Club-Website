import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

function toArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function useFetch(url, deps = []) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(url);
      setData(toArray(res.data));
      setError(null);
    } catch (err) {
      setData([]);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  return { data, loading, error, refetch: fetchData };
}

function useFetchObject(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(url);
      setData(res.data || null);
      setError(null);
    } catch (err) {
      setData(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  return { data, loading, error, refetch: fetchData };
}

export const useTicker = () => useFetch('/ticker');
export const useAnnouncements = (limit = 8) => useFetch(`/announcements?limit=${limit}`, [limit]);
export const useEvents = (type = 'upcoming') => useFetch(`/events?type=${type}`, [type]);
export const usePhotos = () => useFetch('/gallery/photos');
export const useVideos = () => useFetch('/gallery/videos');
export const useGalleryFolders = () => useFetch('/gallery/folders');
export const useGalleryFolderMedia = (slug) => useFetchObject(`/gallery/folders/${slug}`, [slug]);
export const useBlog = (limit = 12) => useFetch(`/blog?limit=${limit}`, [limit]);
export const useTeam = () => useFetch('/team');

export const useAdminTicker = () => useFetch('/ticker/admin/list');
export const useAdminAnnouncements = () => useFetch('/announcements/admin/list');
export const useAdminEvents = () => useFetch('/events/admin/list');
export const useAdminPhotos = () => useFetch('/gallery/admin/photos');
export const useAdminVideos = () => useFetch('/gallery/admin/videos');
export const useAdminGalleryFolders = () => useFetch('/gallery/admin/folders');
export const useAdminBlog = () => useFetch('/blog/admin/list');
export const useAdminTeam = () => useFetch('/team/admin/list');
