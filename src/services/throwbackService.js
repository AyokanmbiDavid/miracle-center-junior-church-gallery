import { supabase } from "../lib/supabase";

export async function getThrowbacks() {
  const { data, error } = await supabase
    .from("throwbacks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function createThrowback(password, payload) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action: "create_throwback",
        password,
        ...payload,
      },
    }
  );

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error);

  return data;
}

export async function deleteThrowback(password, throwback_id) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action: "delete_throwback",
        password,
        throwback_id,
      },
    }
  );

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error);

  return data;
}