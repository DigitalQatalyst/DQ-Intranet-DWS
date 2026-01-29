import { supabase } from './supabaseClient';
import { User } from '../utils/types';

// Interface for WFH request submission payload
export interface WFHRequestPayload {
  request_name: string;
  wfh_date: string;
  end_date?: string; // Optional for multi-day WFH
  reason: string;
  submitted_by_email?: string;
  submitted_by_name?: string;
}

// Interface for WFH request with approvers
export interface WFHRequestWithApprovers extends WFHRequestPayload {
  approvers: User[];
}

// Submit WFH request and link approvers
export const submitWFHRequestWithApprovers = async (
  formData: WFHRequestWithApprovers
): Promise<any> => {
  try {
    // Step 1: Insert the WFH request
    const { data: wfhRequest, error: requestError } = await supabase
      .from('wfh_requests')
      .insert([
        {
          request_name: formData.request_name,
          wfh_date: formData.wfh_date,
          end_date: formData.end_date || null,
          reason: formData.reason,
          expected_hours: formData.expected_hours,
          submitted_by_email: formData.submitted_by_email || null,
          submitted_by_name: formData.submitted_by_name || null,
          status: 'pending',
        },
      ])
      .select()
      .single(); // Get single object instead of array

    if (requestError) {
      throw new Error(`Failed to create WFH request: ${requestError.message}`);
    }

    // Step 2: Insert approver associations
    if (formData.approvers.length > 0) {
      const approverInserts = formData.approvers.map((approver) => ({
        wfh_request_id: wfhRequest.id,
        approver_id: approver.id,
      }));

      const { error: approversError } = await supabase
        .from('wfh_request_approvers')
        .insert(approverInserts);

      if (approversError) {
        throw new Error(`Failed to add approvers: ${approversError.message}`);
      }
    }

    // eslint-disable-next-line no-console
    console.log('WFH request submitted successfully:', wfhRequest);
    return wfhRequest;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Submission error:', error);
    throw error;
  }
};

// Fetch all active approvers (reuses same approvers table)
export const fetchActiveApprovers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('approvers')
    .select('id, name, email, initials, color')
    .eq('is_active', true)
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch approvers: ${error.message}`);
  }

  return data || [];
};

// Fetch WFH requests with approvers
export const fetchWFHRequests = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('wfh_requests')
    .select(
      `
      *,
      wfh_request_approvers (
        approver:approvers (
          id,
          name,
          email,
          initials,
          color
        )
      )
    `
    )
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch WFH requests: ${error.message}`);
  }

  return data || [];
};

// Update WFH request status
export const updateWFHRequestStatus = async (
  id: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> => {
  const { error } = await supabase
    .from('wfh_requests')
    .update({ status })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update status: ${error.message}`);
  }

  return true;
};
