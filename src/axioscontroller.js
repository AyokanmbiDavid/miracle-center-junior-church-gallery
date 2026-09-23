import API from './axios';

// --- MEMBER API CALLS ---
export const fetchMembers = async (classParam) => {
  try {
    // Safely extract className whether passed as a string ("Pre-teens") or an object ({ className: "Pre-teens" })
    const className = typeof classParam === 'object' && classParam !== null ? classParam.className : classParam;

    const res = await API.get('/members', { params: { className } });
    return res.data;
  } catch (error) {
    console.error('fetchMembers error:', error);
    throw error.response?.data || error.message;
  }
};

export const createMember = async (formData) => {
  try {
    const res = await API.post('/members', formData);
    return res.data;
  } catch (error) {
    console.error('createMember error:', error);
    throw error.response?.data || error.message;
  }
};

export const updateMember = async (id, formData) => {
  try {
    const res = await API.put(`/members/${id}`, formData);
    return res.data;
  } catch (error) {
    console.error('updateMember error:', error);
    throw error.response?.data || error.message;
  }
};

export const deleteMember = async (id) => {
  try {
    const res = await API.delete(`/members/${id}`);
    return res.data;
  } catch (error) {
    console.error('deleteMember error:', error);
    throw error.response?.data || error.message;
  }
};

// ... keep your other status and throwback exports below ...

// --- SUNDAY STATUS API CALLS ---
export const fetchStatuses = async () => {
  try {
    const res = await API.get('/statuses');
    return res.data;
  } catch (error) {
    console.error('fetchStatuses error:', error);
    throw error.response?.data || error.message;
  }
};

export const createStatus = async (formData) => {
  try {
    const res = await API.post('/statuses', formData);
    return res.data;
  } catch (error) {
    console.error('createStatus error:', error);
    throw error.response?.data || error.message;
  }
};

export const updateStatus = async (id, formData) => {
  try {
    const res = await API.put(`/statuses/${id}`, formData);
    return res.data;
  } catch (error) {
    console.error('updateStatus error:', error);
    throw error.response?.data || error.message;
  }
};

export const toggleStatusTag = async (id) => {
  try {
    const res = await API.patch(`/statuses/${id}/toggle-new`);
    return res.data;
  } catch (error) {
    console.error('toggleStatusTag error:', error);
    throw error.response?.data || error.message;
  }
};

export const likeStatus = async (id) => {
  try {
    const res = await API.patch(`/statuses/${id}/like`);
    return res.data;
  } catch (error) {
    console.error('likeStatus error:', error);
    throw error.response?.data || error.message;
  }
};

export const deleteStatus = async (id) => {
  try {
    const res = await API.delete(`/statuses/${id}`);
    return res.data;
  } catch (error) {
    console.error('deleteStatus error:', error);
    throw error.response?.data || error.message;
  }
};

// --- THROWBACK API CALLS ---
export const fetchThrowbacks = async (searchQuery) => {
  try {
    const res = await API.get('/throwbacks', { params: { search: searchQuery } });
    return res.data;
  } catch (error) {
    console.error('fetchThrowbacks error:', error);
    throw error.response?.data || error.message;
  }
};

export const createThrowback = async (formData) => {
  try {
    const res = await API.post('/throwbacks', formData);
    return res.data;
  } catch (error) {
    console.error('createThrowback error:', error);
    throw error.response?.data || error.message;
  }
};

export const updateThrowback = async (id, formData) => {
  try {
    const res = await API.put(`/throwbacks/${id}`, formData);
    return res.data;
  } catch (error) {
    console.error('updateThrowback error:', error);
    throw error.response?.data || error.message;
  }
};

export const likeThrowback = async (id) => {
  try {
    const res = await API.patch(`/throwbacks/${id}/like`);
    return res.data;
  } catch (error) {
    console.error('likeThrowback error:', error);
    throw error.response?.data || error.message;
  }
};

export const deleteThrowback = async (id) => {
  try {
    const res = await API.delete(`/throwbacks/${id}`);
    return res.data;
  } catch (error) {
    console.error('deleteThrowback error:', error);
    throw error.response?.data || error.message;
  }
};