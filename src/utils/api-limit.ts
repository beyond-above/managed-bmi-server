
import { supabase } from '@/integrations/supabase/client';

/**
 * Tracks an API request for the rate limiting system
 * @param userId - The ID of the user making the request
 * @param requestType - The type of request being made (e.g. 'bmi_calculation')
 * @returns True if the request was tracked successfully, false otherwise
 */
export const trackApiRequest = async (userId: string, requestType: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('api_requests')
      .insert({
        user_id: userId,
        request_type: requestType,
      });
      
    if (error) {
      console.error('Error tracking API request:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in trackApiRequest:', error);
    return false;
  }
};

/**
 * Checks if a user has exceeded their API request limit
 * @param userId - The ID of the user to check
 * @param limit - The maximum number of requests allowed
 * @returns True if the user has exceeded their limit, false otherwise
 */
export const hasExceededApiLimit = async (userId: string, limit: number): Promise<boolean> => {
  try {
    // Get requests from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error, count } = await supabase
      .from('api_requests')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo.toISOString());
      
    if (error) {
      console.error('Error checking API limit:', error);
      return true; // Safer to return true (limit exceeded) on error
    }
    
    return (count || 0) >= limit;
  } catch (error) {
    console.error('Error in hasExceededApiLimit:', error);
    return true; // Safer to return true (limit exceeded) on error
  }
};
