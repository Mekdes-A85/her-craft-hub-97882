import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message, phone } = await req.json();
    
    console.log('Received SMS:', { message, phone });

    // Check if message is "a" (case insensitive) for non-smartphone users
    if (message && message.toLowerCase().trim() === 'a') {
      // Find the profile by phone number
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .eq('has_smartphone', false)
        .single();

      if (profileError || !profile) {
        console.error('Profile not found:', profileError);
        return new Response(
          JSON.stringify({ error: 'Profile not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      console.log('Found profile:', profile);

      // Find pending orders for this supplier
      const { data: orders, error: ordersError } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('supplier_id', profile.id)
        .eq('status', 'pending');

      if (ordersError) {
        console.error('Orders fetch error:', ordersError);
        throw ordersError;
      }

      console.log('Found orders:', orders);

      if (!orders || orders.length === 0) {
        return new Response(
          JSON.stringify({ message: 'No pending orders found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update all pending orders to 'ready' status
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({ status: 'ready' })
        .eq('supplier_id', profile.id)
        .eq('status', 'pending');

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log('Orders updated to ready status');

      // TODO: Notify delivery system providers
      // This would integrate with your delivery system API
      const deliveryNotification = {
        supplier_id: profile.id,
        supplier_name: profile.name,
        supplier_phone: profile.phone,
        orders_count: orders.length,
        timestamp: new Date().toISOString(),
      };

      console.log('Delivery notification:', deliveryNotification);

      // Send confirmation SMS back to supplier
      const confirmationMessage = `Thank you! Your ${orders.length} order(s) have been marked as ready for pickup. Delivery team has been notified.`;

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: confirmationMessage,
          orders_updated: orders.length 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Command not recognized' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
