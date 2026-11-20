import { supabase } from "../lib/supabase";

export async function getStatuses(archived = false) {
  const { data, error } = await supabase
    .from("statuses")
    .select("*")
    .eq("is_archived", archived)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function createStatus(password, payload) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action: "create_status",
        password,
        ...payload,
      },
    }
  );

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error);

  return data;
}

export async function archiveStatus(password, status_id) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action: "archive_status",
        password,
        status_id,
      },
    }
  );

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error);

  return data;
}

export async function deleteStatus(password, status_id) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action: "delete_status",
        password,
        status_id,
      },
    }
  );

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error);

  return data;
}