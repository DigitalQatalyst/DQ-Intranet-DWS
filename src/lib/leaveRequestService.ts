import { supabase } from './supabaseClient';
import { User } from '../utils/types';

// Interface for leave request submission payload
export interface LeaveRequestPayload {
  request_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  submitted_by_email?: string;
  submitted_by_name?: string;
}

// Interface for leave request with approvers
export interface LeaveRequestWithApprovers extends LeaveRequestPayload {
  approvers: User[];
}

// Submit leave request and link approvers
export const submitLeaveRequestWithApprovers = async (
  formData: LeaveRequestWithApprovers
): Promise<any> => {
  try {
    // Step 1: Insert the leave request
    const { data: leaveRequest, error: requestError } = await supabase
      .from('leave_requests')
      .insert([
        {
          request_name: formData.request_name,
          leave_type: formData.leave_type,
          start_date: formData.start_date,
          end_date: formData.end_date,
          reason: formData.reason,
          submitted_by_email: formData.submitted_by_email || null,
          submitted_by_name: formData.submitted_by_name || null,
          status: 'pending',
        },
      ])
      .select()
      .single(); // Get single object instead of array

    if (requestError) {
      throw new Error(`Failed to create leave request: ${requestError.message}`);
    }

    // Step 2: Insert approver associations
    if (formData.approvers.length > 0) {
      const approverInserts = formData.approvers.map((approver) => ({
        leave_request_id: leaveRequest.id,
        approver_id: approver.id,
      }));

      const { error: approversError } = await supabase
        .from('leave_request_approvers')
        .insert(approverInserts);

      if (approversError) {
        throw new Error(`Failed to add approvers: ${approversError.message}`);
      }
    }

    // eslint-disable-next-line no-console
    console.log('Leave request submitted successfully:', leaveRequest);
    return leaveRequest;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Submission error:', error);
    throw error;
  }
};

// Fetch all active approvers
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

// Fetch leave requests with approvers
export const fetchLeaveRequests = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('leave_requests')
    .select(
      `
      *,
      leave_request_approvers (
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
    throw new Error(`Failed to fetch leave requests: ${error.message}`);
  }

  return data || [];
};

// Update leave request status
export const updateLeaveRequestStatus = async (
  id: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> => {
  const { error } = await supabase
    .from('leave_requests')
    .update({ status })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to update status: ${error.message}`);
  }

  return true;
};
