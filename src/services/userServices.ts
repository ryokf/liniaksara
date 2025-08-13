import supabase from "@/config/supabase";

export const getUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Failed to fetch user:", error);
            return;
        }
        return user;
    } catch (err) {
        console.error("Unexpected error while fetching user:", err);
        return;
    }
};
