import { create } from "zustand";

interface VideoStore {
  selectedVideo: string | null;
  setSelectedVideo: (videoId: string | null) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  selectedVideo: null,
  setSelectedVideo: (videoId) => set({ selectedVideo: videoId }),
}));
