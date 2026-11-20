import { supabase } from "../lib/supabase";

export async function getMembers() {
  const { data, error } = await supabase
    .from("members")
    .select(`
      *,
      exco_positions (
        id,
        position_name
      )
    `)
    .order("name");

  if (error) throw error;

  return data || [];
}

export async function getMember(id) {
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createMember(password, payload) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action: "create_member",
        password,
        ...payload,
      },
    }
  );

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error);

  return data;
}

export async function updateMember(password, payload) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action: "update_member",
        password,
        ...payload,
      },
    }
  );

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error);

  return data;
}

export async function deleteMember(password, member_id) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action: "delete_member",
        password,
        member_id,
      },
    }
  );

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error);

  return data;
}