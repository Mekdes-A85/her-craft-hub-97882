import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { phone, keyword, orderId } = await req.json();
    
    console.log('SMS received:', { phone, keyword, orderId });

    // Check if keyword is "a" (accept/ready)
    if (keyword?.toLowerCase() === 'a') {
      // Find the supplier by phone
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .eq('role', 'supplier')
        .single();

      if (profileError || !profile) {
        console.error('Supplier not found:', profileError);
        return new Response(
          JSON.stringify({ error: 'Supplier not found' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }

      // Update the order status to 'ready'
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .update({ status: 'ready' })
        .eq('id', orderId)
        .eq('supplier_id', profile.id)
        .select()
        .single();

      if (orderError) {
        console.error('Order update error:', orderError);
        return new Response(
          JSON.stringify({ error: 'Failed to update order' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      console.log('Order updated successfully:', order);

      // TODO: Notify delivery system here
      // You would integrate with your delivery service API

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Order marked as ready for pickup',
          order 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid keyword. Send "a" to confirm order is ready.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});