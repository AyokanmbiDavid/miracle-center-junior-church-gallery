import { supabase } from "../lib/supabase";

export async function getPositions() {
  const { data, error } = await supabase
    .from("exco_positions")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) throw error;

  return data || [];
}

export async function createPosition(password, position_name) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action: "create_position",
        password,
        position_name,
      },
    }
  );

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error);

  return data;
}

export async function assignMember(
  password,
  member_id,
  position_id
) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action: "assign_member",
        password,
        member_id,
        position_id,
      },
    }
  );

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error);

  return data;
}

export async function unassignMember(password, position_id) {
  const { data, error } = await supabase.functions.invoke(
    "admin-actions",
    {
      body: {
        action: "unassign_member",
        password,
        position_id,
      },
    }
  );

  if (error) throw error;
  if (!data?.success) throw new Error(data?.error);

  return data;
}