// store/recentRoadmapsStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RecentRoadmap = {
    skill: string;
    score: number;
    title: string;
    timestamp: string;
    progress: number;
    preferredLanguage: string;
};

interface RecentRoadmapsState {
    recentRoadmaps: RecentRoadmap[];
    addRecentRoadmap: (roadmap: RecentRoadmap) => void;
    removeRoadmap: (index: number) => void;
    clearRoadmaps: () => void;
}

export const useRecentRoadmapsStore = create<RecentRoadmapsState>()(
    persist(
        (set) => ({
            recentRoadmaps: [],

            addRecentRoadmap: (roadmap: RecentRoadmap) => set((state) => {
                // Check if roadmap already exists
                const existingIndex = state.recentRoadmaps.findIndex(
                    (item) => item.skill === roadmap.skill && item.score === roadmap.score
                );

                let updatedRoadmaps = [...state.recentRoadmaps];

                if (existingIndex !== -1) {
                    // Update existing roadmap
                    updatedRoadmaps[existingIndex] = {
                        ...roadmap,
                        timestamp: new Date().toISOString() // Update timestamp
                    };
                } else {
                    // Add new roadmap to beginning
                    updatedRoadmaps = [
                        {
                            ...roadmap,
                            timestamp: new Date().toISOString()
                        },
                        ...state.recentRoadmaps
                    ];
                }

                // Keep only 5 most recent
                return { recentRoadmaps: updatedRoadmaps.slice(0, 5) };
            }),

            removeRoadmap: (index: number) => set((state) => ({
                recentRoadmaps: state.recentRoadmaps.filter((_, i) => i !== index)
            })),

            clearRoadmaps: () => set({ recentRoadmaps: [] })
        }),
        {
            name: 'recent-roadmaps-storage'
        }
    )
);