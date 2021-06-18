/* eslint-disable @typescript-eslint/no-explicit-any */
export const getLanguages = async (): Promise<Record<string, any>[]> => {
  try {
    const response = await fetch("http://api.alquran.cloud/v1/edition/language");
    const json = await response.json();
  
    if (!response.ok) {
      throw new Error(json.error);
    }
    return json.data;
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const getEdition = async (
  format: string | null = "text", 
  language: string | null = "en", 
  type: string | null = "translation"
): Promise<Record<string, any>[]> => {
  try {
    const response = await fetch(`http://api.alquran.cloud/v1/edition?format=${format}&language=${language}&type=${type}`);
    const json = await response.json();
  
    if (!response.ok) {
      throw new Error(json.error);
    }
    return json.data;
  } catch (e) {
    console.error(e);
    return e;
  }
}

export const getQuran = async (
  edition: string | null = "quran-uthmani"
): Promise<Record<string, any>> => {
  const response = await fetch(`http://api.alquran.cloud/v1/quran/{${edition}`);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }
  return json.data;
}