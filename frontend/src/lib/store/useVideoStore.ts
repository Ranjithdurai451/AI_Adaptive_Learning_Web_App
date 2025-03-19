import { create } from "zustand";
import { VideoData } from "../types";

interface VideoStore {
  selectedVideo: VideoData | null;
  setSelectedVideo: (url: VideoData | null) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  selectedVideo: null,
  setSelectedVideo: (video) => set({ selectedVideo: video }),
}));
