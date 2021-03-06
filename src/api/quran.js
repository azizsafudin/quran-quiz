export const getLanguages = async () => {
  try {
    const response = await fetch("https://api.alquran.cloud/v1/edition/language");
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
  format, 
  language, 
  type
) => {
  try {
    const response = await fetch(`https://api.alquran.cloud/v1/edition?format=${format}&language=${language}&type=${type}`);
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
  edition = "quran-uthmani"
) => {
  const response = await fetch(`https://api.alquran.cloud/v1/quran/${edition}`);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error);
  }
  return json.data;
}