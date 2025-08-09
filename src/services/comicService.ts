import supabase from '@/config/supabase';
// Pastikan path import untuk tipe Comic dan Author sudah benar
import type { Comic } from '../types/comic';

/**
 * Mengambil data komik terbaru beserta data lengkap author-nya.
 * @param limit Jumlah data yang ingin diambil (default: 6)
 * @returns Promise yang berisi array objek Comic
 */
export const getLatestComics = async (limit: number = 6): Promise<Comic[]> => {
    const { data, error } = await supabase
        .from('works')
        // Mengambil semua kolom dari 'works' dan semua kolom dari tabel 'users' yang berelasi,
        // lalu memasukkannya ke dalam properti 'author'.
        .select('*, author:profiles(*)')
        .eq('work_type_id', 30) // Assuming 30 is the ID for comics
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        // Lebih baik log error di sisi server juga jika memungkinkan
        console.error('Supabase error fetching latest comics with authors:', error);
        throw new Error(`Failed to fetch latest comics: ${error.message}`);
    }

    // Data yang dikembalikan sudah memiliki struktur yang sesuai dengan tipe Comic yang diperbarui
    return data as Comic[];
}