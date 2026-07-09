"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";

/**
 * Live "someone received your card" notifications for the card owner.
 * Listens to view_count updates on the user's cards via Supabase Realtime
 * (requires: ALTER PUBLICATION supabase_realtime ADD TABLE public.cards).
 */
export default function ScanListener({ userId }: { userId: string }) {
  const { toast } = useToast();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("card-scans")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "cards",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          toast("📨 Someone just received your card! ✨");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, toast]);

  return null;
}
