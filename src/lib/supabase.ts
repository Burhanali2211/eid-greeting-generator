import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Track missing columns to avoid repetitive error messages
const missingColumns = {
  is_expired: false,
  viewed_by: false,
  upi_id: false,
  enable_upi_payment: false,
  is_paid: false
};

// Type definitions for Supabase tables
export type Greeting = {
  id: string;
  created_at: string;
  sender_id: string;
  recipient_name: string;
  message: string;
  amounts: number[];
  selected_card: number | null;
  viewed_by?: string | null;
  is_expired?: boolean;
  upi_id?: string | null;
  enable_upi_payment?: boolean;
  is_paid?: boolean;
};

// Initialize database schema if needed
export async function initializeSchema() {
  try {
    console.log("Checking database schema for required columns...");
    
    // Check if 'is_expired' column exists
    const isExpiredResult = await supabase
      .from('greetings')
      .select('is_expired')
      .limit(1);
    
    if (isExpiredResult.error && isExpiredResult.error.message.includes("does not exist")) {
      console.log("Missing 'is_expired' column in greetings table");
      missingColumns.is_expired = true;
    }
    
    // Check if 'viewed_by' column exists
    const viewedByResult = await supabase
      .from('greetings')
      .select('viewed_by')
      .limit(1);
    
    if (viewedByResult.error && viewedByResult.error.message.includes("does not exist")) {
      console.log("Missing 'viewed_by' column in greetings table");
      missingColumns.viewed_by = true;
    }
    
    // Check if 'upi_id' column exists
    const upiIdResult = await supabase
      .from('greetings')
      .select('upi_id')
      .limit(1);
    
    if (upiIdResult.error && upiIdResult.error.message.includes("does not exist")) {
      console.log("Missing 'upi_id' column in greetings table");
      missingColumns.upi_id = true;
    }
    
    // Check if 'enable_upi_payment' column exists
    const enableUpiResult = await supabase
      .from('greetings')
      .select('enable_upi_payment')
      .limit(1);
    
    if (enableUpiResult.error && enableUpiResult.error.message.includes("does not exist")) {
      console.log("Missing 'enable_upi_payment' column in greetings table");
      missingColumns.enable_upi_payment = true;
    }
    
    // Check if 'is_paid' column exists
    const isPaidResult = await supabase
      .from('greetings')
      .select('is_paid')
      .limit(1);
    
    if (isPaidResult.error && isPaidResult.error.message.includes("does not exist")) {
      console.log("Missing 'is_paid' column in greetings table");
      missingColumns.is_paid = true;
    }
    
    if (Object.values(missingColumns).some(value => value)) {
      console.log("Schema is missing columns. The application will handle this gracefully.");
      console.log("To add these columns permanently, run the following SQL in your Supabase SQL editor:");
      
      if (missingColumns.is_expired) {
        console.log("ALTER TABLE greetings ADD COLUMN IF NOT EXISTS is_expired BOOLEAN DEFAULT FALSE;");
      }
      
      if (missingColumns.viewed_by) {
        console.log("ALTER TABLE greetings ADD COLUMN IF NOT EXISTS viewed_by TEXT DEFAULT NULL;");
      }
      
      if (missingColumns.upi_id) {
        console.log("ALTER TABLE greetings ADD COLUMN IF NOT EXISTS upi_id TEXT DEFAULT NULL;");
      }
      
      if (missingColumns.enable_upi_payment) {
        console.log("ALTER TABLE greetings ADD COLUMN IF NOT EXISTS enable_upi_payment BOOLEAN DEFAULT FALSE;");
      }
      
      if (missingColumns.is_paid) {
        console.log("ALTER TABLE greetings ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE;");
      }
    } else {
      console.log("Database schema validation complete. All required columns exist.");
    }
    
    return { success: true, error: null, missingColumns };
  } catch (error) {
    console.error("Error initializing schema:", error);
    return { success: false, error, missingColumns };
  }
}

// Call this on app start
initializeSchema().catch(console.error);

// Helper function to safely construct insert/update objects
function getSafeDbObject(obj: Record<string, any>): Record<string, any> {
  const safeObj = { ...obj };
  
  // Remove fields known to be missing in the schema
  if (missingColumns.is_expired && 'is_expired' in safeObj) {
    delete safeObj.is_expired;
  }
  
  if (missingColumns.viewed_by && 'viewed_by' in safeObj) {
    delete safeObj.viewed_by;
  }
  
  if (missingColumns.upi_id && 'upi_id' in safeObj) {
    delete safeObj.upi_id;
  }
  
  if (missingColumns.enable_upi_payment && 'enable_upi_payment' in safeObj) {
    delete safeObj.enable_upi_payment;
  }
  
  if (missingColumns.is_paid && 'is_paid' in safeObj) {
    delete safeObj.is_paid;
  }
  
  return safeObj;
}

// Helper function to create a greeting
export async function createGreeting(
  senderId: string,
  recipientName: string,
  message: string,
  amounts: number[],
  upiId?: string | null,
  enableUpiPayment?: boolean
): Promise<{ data: Greeting | null; error: any }> {
  try {
  // Shuffle the amounts for unpredictability
  const shuffledAmounts = [...amounts].sort(() => Math.random() - 0.5);

    // Create base object with proper type
    const greetingData: Record<string, any> = {
      sender_id: senderId,
      recipient_name: recipientName,
      message,
      amounts: shuffledAmounts,
      selected_card: null,
    };
    
    // Add optional fields only if they exist in schema
    if (!missingColumns.viewed_by) {
      greetingData.viewed_by = null;
    }
    
    if (!missingColumns.is_expired) {
      greetingData.is_expired = false;
    }
    
    // Add UPI payment information if provided
    if (enableUpiPayment && upiId) {
      // Try to add UPI fields regardless of missing columns status
      // Supabase will ignore fields that don't exist in the table schema
      greetingData.upi_id = upiId;
      greetingData.enable_upi_payment = true;
      
      // Log that we're attempting to save UPI data
      console.log("Attempting to save UPI payment data:", { upiId, enableUpiPayment });
    }

    // Insert greeting
    const result = await supabase
      .from("greetings")
      .insert(greetingData)
      .select()
      .single();
    
    // If there's an error related to missing columns, try again with a safer object
    if (result.error && (
        result.error.message.includes("is_expired") || 
        result.error.message.includes("viewed_by") ||
        result.error.message.includes("upi_id") ||
        result.error.message.includes("enable_upi_payment"))) {
      
      // Log the error for debugging
      console.log("First insert attempt failed:", result.error.message);
      console.log("Retrying with only core columns");
      
      // Retry with only required fields
      const safeResult = await supabase
        .from("greetings")
        .insert({
      sender_id: senderId,
      recipient_name: recipientName,
      message,
      amounts: shuffledAmounts,
      selected_card: null,
    })
    .select()
    .single();

      if (safeResult.data) {
        // Ensure all expected fields exist (add defaults if missing)
        const greeting: Greeting = {
          ...safeResult.data,
          is_expired: safeResult.data.is_expired === undefined ? false : safeResult.data.is_expired,
          viewed_by: safeResult.data.viewed_by || null,
          upi_id: enableUpiPayment && upiId ? upiId : null, // Retain UPI data even if not saved to DB
          enable_upi_payment: enableUpiPayment || false, // Retain UPI flag even if not saved to DB
        };
        
        console.log("Created greeting with default values for missing fields:", greeting);
        return { data: greeting, error: null };
      }
      
      return safeResult;
    }

    // If success, return the data with default values for any missing fields
    if (result.data) {
      // Ensure all expected fields exist (add defaults if missing)
      const greeting: Greeting = {
        ...result.data,
        is_expired: result.data.is_expired === undefined ? false : result.data.is_expired,
        viewed_by: result.data.viewed_by || null,
        upi_id: result.data.upi_id || (enableUpiPayment && upiId ? upiId : null), // Use provided value if not saved
        enable_upi_payment: result.data.enable_upi_payment === undefined ? !!enableUpiPayment : result.data.enable_upi_payment,
      };
      
      console.log("Successfully created greeting with all fields:", greeting);
      return { data: greeting, error: null };
    }

    return result;
  } catch (error) {
    console.error("Error in createGreeting:", error);
    return { data: null, error };
  }
}

// Helper function to get greeting by ID
export async function getGreetingById(
  id: string,
  viewerId?: string
): Promise<{ data: Greeting | null; error: any; accessDenied?: boolean }> {
  try {
  const { data, error } = await supabase
    .from("greetings")
    .select("*")
    .eq("id", id)
    .single();

    if (error) {
      console.error("Error fetching greeting:", error);
      return { data: null, error };
    }

    if (!data) {
      return { data: null, error: null };
    }

    // Add default values for potentially missing fields
    const greeting: Greeting = {
      ...data,
      is_expired: data.is_expired === undefined ? false : data.is_expired,
      viewed_by: data.viewed_by || null,
      upi_id: data.upi_id || null,
      enable_upi_payment: data.enable_upi_payment === undefined ? false : data.enable_upi_payment,
    };

    // Log the retrieved greeting data
    console.log("Retrieved greeting:", {
      id: greeting.id,
      sender_id: greeting.sender_id,
      recipient_name: greeting.recipient_name,
      selected_card: greeting.selected_card,
      is_expired: greeting.is_expired,
      hasUpiId: !!greeting.upi_id,
      enable_upi_payment: greeting.enable_upi_payment
    });

    // If the sender is viewing their own greeting, always allow access
    if (viewerId && greeting.sender_id === viewerId) {
      return { data: greeting, error: null };
    }

    // We only check viewed_by if the column exists in the database
    if (!missingColumns.viewed_by) {
      // If the greeting has already been viewed by someone else, deny access
      if (greeting.viewed_by && greeting.viewed_by !== viewerId) {
        return { data: null, error: null, accessDenied: true };
      }
    }
    
    // We only check is_expired if the column exists in the database
    if (!missingColumns.is_expired) {
      // If the greeting is explicitly marked as expired, deny access
      if (greeting.is_expired === true) {
        return { data: null, error: null, accessDenied: true };
      }
    }

    return { data: greeting, error: null };
  } catch (error) {
    console.error("Error in getGreetingById:", error);
    return { data: null, error };
  }
}

// Helper function to update selected card
export async function updateSelectedCard(
  id: string,
  selectedCard: number,
  viewerId: string
): Promise<{ data: Greeting | null; error: any }> {
  try {
    // Create base update object with proper type
    const updateData: Record<string, any> = { selected_card: selectedCard };
    
    // Only add viewed_by if the column exists
    if (!missingColumns.viewed_by) {
      updateData.viewed_by = viewerId;
    }

    // Update greeting
    const result = await supabase
      .from("greetings")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
    
    // If error mentions viewed_by doesn't exist, try without it
    if (result.error && result.error.message.includes("viewed_by")) {
      console.log("Retrying without viewed_by column");
      missingColumns.viewed_by = true; // Update our tracking
      
      const retryResult = await supabase
    .from("greetings")
    .update({ selected_card: selectedCard })
    .eq("id", id)
    .select()
    .single();

      return retryResult;
    }

    return result;
  } catch (error) {
    console.error("Error in updateSelectedCard:", error);
    return { data: null, error };
  }
}

// Helper function to mark a greeting as expired (one-time viewing)
export async function expireGreeting(
  id: string
): Promise<{ data: Greeting | null; error: any }> {
  try {
    // Skip if we know is_expired doesn't exist
    if (missingColumns.is_expired) {
      console.log("Skipping expireGreeting - is_expired column doesn't exist");
      // Try to fetch the greeting data to return
      const { data } = await supabase
        .from("greetings")
        .select("*")
        .eq("id", id)
        .single();
        
      return { data, error: null };
    }

    // Try to update is_expired field
    const result = await supabase
      .from("greetings")
      .update({ is_expired: true })
      .eq("id", id)
      .select()
      .single();
    
    // If error mentions the is_expired column doesn't exist, update our tracking
    if (result.error && result.error.message.includes("is_expired")) {
      console.log("Could not expire greeting - column doesn't exist");
      missingColumns.is_expired = true;
      
      // Try to fetch the greeting data to return
      const { data } = await supabase
        .from("greetings")
        .select("*")
        .eq("id", id)
        .single();
        
      return { data, error: null };
    }

    return result;
  } catch (error) {
    console.error("Error in expireGreeting:", error);
    return { data: null, error };
  }
}

// Helper function to get all greetings for a sender
export async function getSenderGreetings(
  senderId: string
): Promise<{ data: Greeting[] | null; error: any }> {
  try {
  const { data, error } = await supabase
    .from("greetings")
    .select("*")
    .eq("sender_id", senderId)
    .order("created_at", { ascending: false });

    if (error) {
      return { data: null, error };
    }

    // Add default values for potentially missing fields
    const greetings = data.map(greeting => ({
      ...greeting,
      is_expired: greeting.is_expired === undefined ? false : greeting.is_expired,
      viewed_by: greeting.viewed_by || null,
      upi_id: greeting.upi_id || null,
      enable_upi_payment: greeting.enable_upi_payment === undefined ? false : greeting.enable_upi_payment,
    }));

    return { data: greetings, error: null };
  } catch (error) {
    console.error("Error in getSenderGreetings:", error);
    return { data: null, error };
  }
} 