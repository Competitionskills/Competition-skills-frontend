export async function uploadImageToCloudinary(file: File, folder?: string) {
  // CRA env vars
  const CLOUD = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const PRESET = process.env.REACT_APP_CLOUDINARY_PRESET;

  if (!CLOUD || !PRESET) {
    console.error("Missing Cloudinary env vars", { CLOUD, PRESET });
    throw new Error("Cloudinary not configured. Check .env values.");
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", PRESET);
  if (folder) fd.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: "POST",
    body: fd,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data.secure_url as string; // store this URL in your DB
}
