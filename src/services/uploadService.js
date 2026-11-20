
import { supabase } from "../lib/supabase";

const MAX_SIZE = 10 * 1024 * 1024;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function validateImage(file) {
  if (!file) {
    throw new Error("Please select an image.");
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Only JPEG, PNG and WEBP images are allowed.");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("Image must not exceed 10 MB.");
  }

  return true;
}

export async function uploadImage({
  password,
  file,
  bucket = "gallery-images",
}) {
  validateImage(file);

  const isMemberPhoto = bucket === "member-photos";

  const action = isMemberPhoto
    ? "create_member_upload"
    : "create_gallery_upload";

  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action,
        password,
        bucket,
        content_type: file.type,
        file_size: file.size,
      },
    }
  );

  if (error) {
    throw new Error(
      error.message || "Could not prepare image upload."
    );
  }

  if (!data?.success) {
    throw new Error(
      data?.error || "Could not prepare upload."
    );
  }

  const { path, token } = data;

  if (!path || !token) {
    throw new Error("Invalid upload response from server.");
  }

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .uploadToSignedUrl(path, token, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  return path;
}

export function getImageUrl(bucket, path) {
  if (!path) return null;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
}
