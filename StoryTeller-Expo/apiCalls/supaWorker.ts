const baseUrl = process.env.EXPO_PUBLIC_SUPABASE_WORKER;
const secret = process.env.EXPO_PUBLIC_TOP_SECRRRET_KEY;

const headers: Record<string, string> = {
  'x-secret-key': secret + '',
  'Content-Type': 'application/json',
};

export const getLibraryChunk = async ({ page, pageSize }: { page: number; pageSize: number }) => {
  try {
    const response = await fetch(`${baseUrl}/api/stories?page=${page}&pageSize=${pageSize}`, {
      method: 'GET',
      headers,
    });
    const data = await response.json();
    if (response.ok) {
      //   console.log('data', data);
      return { success: true, data };
    }
  } catch (err: any) {
    console.log('error in api call: ', err.message);
    return { success: false, msg: err.message };
  }
};

interface itemToLibrary {
  story: string;
  image: string;
  title: string;
  date: Date;
  audio_file_url: string;
}

export const addLibraryItem = async (item: itemToLibrary) => {
  try {
    const response = await fetch(`${baseUrl}/api/stories`, {
      method: 'POST',
      headers,
      body: JSON.stringify(item),
    });
    const data = await response.json();
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, msg: data.error };
    }
  } catch (err: any) {
    console.log('error saving to library: ', err.message);
    return { success: false, msg: err.message };
  }
};
