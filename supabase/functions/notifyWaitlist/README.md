# Waitlist Notification Function

This Supabase Edge Function sends email notifications when new users join the waitlist.

## Deployment Instructions

Since we couldn't deploy the function directly through the CLI due to Docker requirements, follow these steps to deploy it manually:

1. **Install Docker Desktop**:

   - Download and install Docker Desktop from [https://docs.docker.com/desktop](https://docs.docker.com/desktop)
   - Start Docker Desktop

2. **Deploy the function**:

   ```sh
   npx supabase functions deploy notifyWaitlist --no-verify-jwt
   ```

3. **Set environment variables**:

   ```sh
   npx supabase secrets set RESEND_API_KEY=your_resend_api_key
   ```

4. **Create a database trigger**:
   - Go to the Supabase dashboard: [https://supabase.com/dashboard/project/ybfbbmzztjuvpdlosfic](https://supabase.com/dashboard/project/ybfbbmzztjuvpdlosfic)
   - Navigate to SQL Editor
   - Run the following SQL:

```sql
-- Create a function that will be triggered when a new waitlist entry is added
CREATE OR REPLACE FUNCTION public.notify_waitlist_entry()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'waitlist_notification',
    json_build_object(
      'name', NEW.name,
      'email', NEW.email,
      'university', NEW.university,
      'interest', NEW.interest
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger that will call the function when a new waitlist entry is added
DROP TRIGGER IF EXISTS notify_waitlist ON public.waitlist;
CREATE TRIGGER notify_waitlist
AFTER INSERT ON public.waitlist
FOR EACH ROW
EXECUTE FUNCTION public.notify_waitlist_entry();
```

5. **Test the function**:
   - Add a new entry to the waitlist table
   - Check if you receive an email notification

## Alternative Approach

If you prefer not to use Edge Functions, you can use a third-party service like Zapier or Make.com to listen for new database entries and send email notifications.

1. Create a webhook in Zapier/Make that triggers when a new row is added to the waitlist table
2. Configure the webhook to send an email using your preferred email service
3. Set up the appropriate authentication and data mapping
