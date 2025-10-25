# SMS Workflow for Non-Smartphone Users

## Overview
This document explains the SMS workflow implementation for suppliers who don't have smartphones.

## How It Works

### 1. Order Placement
When a client places an order, the order status is set to `pending` by default.

### 2. SMS Notification to Supplier
When an order is placed:
- The supplier (if `has_smartphone: false`) receives an SMS notification about the new order
- The SMS includes order details and instructions to reply with "a" to accept

### 3. Supplier Response
When the supplier texts back with the keyword "a" (case-insensitive):
1. The system receives the SMS via the `sms-handler` edge function
2. The function looks up the supplier by phone number
3. All pending orders for that supplier are updated to status `ready`
4. Delivery system providers are notified (via integration point)
5. Supplier receives confirmation SMS

### 4. Order Status Flow
```
pending → ready → (picked up by delivery) → delivered
```

## Edge Function: sms-handler

**Endpoint**: `https://<project-id>.supabase.co/functions/v1/sms-handler`

**Method**: POST

**Payload**:
```json
{
  "message": "a",
  "phone": "+251912345678"
}
```

**Response** (Success):
```json
{
  "success": true,
  "message": "Thank you! Your 2 order(s) have been marked as ready for pickup. Delivery team has been notified.",
  "orders_updated": 2
}
```

## Integration with SMS Gateway

To integrate this with an actual SMS service (like Twilio, Africa's Talking, etc.):

1. Set up a webhook from your SMS provider to call the `sms-handler` function
2. Map the incoming SMS fields to the expected payload format
3. Implement outgoing SMS in the function to send confirmations

Example with Twilio:
```typescript
// In the edge function, add Twilio integration
const twilioClient = new Twilio(accountSid, authToken);

await twilioClient.messages.create({
  body: confirmationMessage,
  from: '+251...',
  to: profile.phone
});
```

## Database Schema

### Profiles Table
- `has_smartphone`: boolean - indicates if supplier has a smartphone
- `phone`: text - supplier's phone number

### Orders Table  
- `status`: enum - `pending`, `in_progress`, `ready`, `delivered`, `cancelled`
- `supplier_id`: references profiles table

## Testing the SMS Workflow

### Manual Testing
```bash
curl -X POST https://<project-id>.supabase.co/functions/v1/sms-handler \
  -H "Content-Type: application/json" \
  -d '{
    "message": "a",
    "phone": "+251912345678"
  }'
```

### Setup for Testing
1. Create a profile with `has_smartphone: false` and a phone number
2. Create pending orders for that supplier
3. Send POST request with the keyword "a"
4. Verify orders status changed to "ready"

## Future Enhancements

1. **Multi-language Support**: Support keywords in Amharic and other local languages
2. **Order Details via SMS**: Allow suppliers to query order details via SMS
3. **Delivery Status Updates**: Notify supplier when order is picked up/delivered
4. **Payment Confirmation**: SMS notification when payment is received
5. **Menu-driven Interface**: Support multiple commands via SMS menu
