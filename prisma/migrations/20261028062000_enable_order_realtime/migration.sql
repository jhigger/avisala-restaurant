-- AlterTable
-- Enable Supabase Realtime publication on "Order" table for websocket CDC broadcasting
ALTER PUBLICATION supabase_realtime ADD TABLE "Order";
