import supabase from "@/config/supabase";

export async function deleteWork(workId: string): Promise<void> {
    // First delete all related parts
    const { error: partsError } = await supabase
        .from('parts')
        .delete()
        .eq('work_id', workId);

    if (partsError) {
        console.error('Error deleting work parts:', partsError);
        throw partsError;
    }

    // Then delete the work itself
    const { error: workError } = await supabase
        .from('works')
        .delete()
        .eq('id', workId);

    if (workError) {
        console.error('Error deleting work:', workError);
        throw workError;
    }
}
