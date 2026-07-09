-- Enable realtime notifications for card scans.
-- The dashboard subscribes to UPDATE events on cards (view_count bumps)
-- to show the owner a cute "someone received your card" toast.
ALTER PUBLICATION supabase_realtime ADD TABLE public.cards;
