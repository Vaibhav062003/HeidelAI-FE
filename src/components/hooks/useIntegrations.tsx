import api from "@/lib/session_api";
import { useEffect, useState, useCallback } from "react";
import { storeData, getData, DB_KEYS } from "@/lib/indexedDB";

interface Integrations {
    instagram: false | InstagramData;
    whatsapp: boolean;
}

interface InstagramData {
    status: boolean;
    username: string;
    profileImage: string;
    userId: string;
    businessInfo: {
        id?: string;
        biography?: string;
        followers_count?: number;
        follows_count?: number;
        media_count?: number;
        name?: string;
        website?: string;
    };
    lastUpdated?: number;
}

interface InstagramPost {
    id: string;
    caption?: string;
    media_url: string;
    media_type: string;
    timestamp: string;
}

export const useIntegrations = () => {
    const [integrations, setIntegrations] = useState<Integrations>({
        instagram: false,
        whatsapp: false,
    });
    const [loading, setLoading] = useState(true); // true only if nothing cached
    const [error, setError] = useState<string | null>(null);

    const fetchFromApi = useCallback(async () => {
        try {
            const response = await api.get("/api/integrations/status");
            const apiData = response.data;

            setIntegrations({
                instagram: apiData.instagram || false,
                whatsapp: apiData.whatsapp || false,
            });

            if (apiData.instagram) {

                const profileResponse = await api.get(`/api/instagram/profile`);

                if (profileResponse.status === 200) {
                    const profileData = profileResponse.data;

                    const instagramData: InstagramData = {
                        status: true,
                        username: profileData.username || "",
                        profileImage: profileData.profile_picture_url || "/default-avatar.png",
                        userId: profileData.id || "",
                        businessInfo: {
                            id: profileData.id,
                            biography: profileData.biography,
                            followers_count: profileData.followers_count,
                            follows_count: profileData.follows_count,
                            media_count: profileData.media_count,
                            name: profileData.name,
                        },
                        lastUpdated: Date.now(),
                    };

                    setIntegrations((prev) => ({
                        ...prev,
                        instagram: instagramData,
                    }));
                    await storeData("integrations", DB_KEYS.INTEGRATIONS.INSTAGRAM, instagramData);

                    const postsResponse = await api.get(`/api/instagram/posts`);
                    if (postsResponse.status == 200) {
                        console.log("Fetched Instagram posts:", postsResponse.data);
                        const posts: InstagramPost[] = postsResponse.data.data;

                        await storeData('integrations', DB_KEYS.INTEGRATIONS.INSTAGRAM_POSTS, {
                            posts,
                            lastUpdated: Date.now()
                        });
                    }
                }
            } else {
                // mark as disconnected but keep last profile data
                const existingData = await getData<InstagramData>(
                    "integrations",
                    DB_KEYS.INTEGRATIONS.INSTAGRAM
                );
                if (existingData && existingData.status) {
                    await storeData("integrations", DB_KEYS.INTEGRATIONS.INSTAGRAM, {
                        ...existingData,
                        status: false,
                        lastUpdated: Date.now(),
                    });
                }
            }

            setError(null);
        } catch (err) {
            console.error("API error:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch from API");
        }
    }, []);

    const fetchIntegrations = useCallback(async () => {
        try {
            // load cached data immediately
            const instagramData = await getData<InstagramData>(
                "integrations",
                DB_KEYS.INTEGRATIONS.INSTAGRAM
            );

            if (instagramData && instagramData.status) {
                console.log("Loaded Instagram from IndexedDB:", instagramData);
                setIntegrations((prev) => ({
                    ...prev,
                    instagram: instagramData || false,
                }));
                setLoading(false); // don’t block UI, show cached instantly

                const isFresh =
                    instagramData.lastUpdated &&
                    Date.now() - instagramData.lastUpdated < 5 * 60 * 1000;

                // refresh silently if stale
                if (!isFresh) {
                    fetchFromApi();
                }
            } else {
                // no cache → show loading until API resolves
                setLoading(true);
                await fetchFromApi();
                setLoading(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch integrations");
            setLoading(false);
        }
    }, [fetchFromApi]);

    useEffect(() => {
        fetchIntegrations();
    }, [fetchIntegrations]);

    const refreshIntegrations = () => {
        fetchFromApi(); // always force refresh in background, no loading spinner
    };

    return {
        integrations,
        loading,
        error,
        refreshIntegrations,
    };
};
