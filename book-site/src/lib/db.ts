import { getSupabase } from "./supabase";

export interface Order {
  id: string;
  order_number: string;
  stripe_session_id: string;
  created_at: string;
  customer_name: string | null;
  email: string | null;
  phone: string | null;
  quantity: number;
  amount: number;
  currency: string;
  address_line1: string | null;
  address_line2: string | null;
  address_city: string | null;
  address_postal_code: string | null;
  address_country: string | null;
  sent: boolean;
  sent_at: string | null;
  notes: string | null;
}

export type NewOrder = Omit<Order, "id" | "order_number" | "created_at">;

export async function createOrder(order: NewOrder): Promise<Order> {
  const supabase = getSupabase();

  const { data: orderNumber, error: seqError } = await supabase.rpc(
    "next_order_number"
  );
  if (seqError) {
    throw new Error(`Failed to generate order number: ${seqError.message}`);
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({ ...order, order_number: orderNumber as string })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
  return data as Order;
}

export async function getOrders(): Promise<Order[]> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch orders: ${error.message}`);
  }
  return (data ?? []) as Order[];
}

export async function updateOrder(
  id: string,
  updates: Partial<Pick<Order, "sent" | "sent_at" | "notes">>
): Promise<Order> {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update order: ${error.message}`);
  }
  return data as Order;
}

export async function orderExistsByStripeSession(
  sessionId: string
): Promise<boolean> {
  const supabase = getSupabase();

  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("stripe_session_id", sessionId);

  if (error) return false;
  return (count ?? 0) > 0;
}
