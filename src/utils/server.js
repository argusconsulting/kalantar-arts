// Example of using the API from frontend
const API_URL = process.env.NEXT_PUBLIC_API_URL;
let authToken = '';

// Helper function for API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  return response.json();
};

// File upload helper
const uploadFile = async (file, multiple = false) => {
  const formData = new FormData();
  
  if (multiple) {
    file.forEach(f => formData.append('files', f));
  } else {
    formData.append('file', file);
  }

  const response = await fetch(`${API_URL}/upload${multiple ? '/multiple' : ''}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    body: formData
  });
  
  return response.json();
};

// Authentication Examples dmfhdj
const auth = {
  // Traditional Login
  async login(username, password) {
    const response = await apiCall('/auth/login', 'POST', { username, password });
    if (response.token) {
      authToken = response.token;
    }
    return response;
  },

  // Register
  async register(username, password, email) {
    return apiCall('/auth/register', 'POST', { username, password, email });
  },

  // Send OTP
  async sendOTP(email) {
    return apiCall('/auth/send-otp', 'POST', { email });
  },

  // Verify OTP
  async verifyOTP(email, otp) {
    const response = await apiCall('/auth/verify-otp', 'POST', { email, otp });
    if (response.token) {
      authToken = response.token;
    }
    return response;
  }
};

// CRUD Examples
const crud = {
  // Single record operations
  async create(table, data) {
    return apiCall(`/${table}`, 'POST', data);
  },

  async read(table, id) {
    return apiCall(`/${table}/${id}`);
  },

  async update(table, id, data) {
    return apiCall(`/${table}/${id}`, 'PUT', data);
  },

  async delete(table, id) {
    return apiCall(`/${table}/${id}`, 'DELETE');
  },

  // Bulk operations
  async bulkCreate(table, records) {
    return apiCall(`/${table}/bulk`, 'POST', records);
  },

  async bulkUpdate(table, records) {
    return apiCall(`/${table}/bulk`, 'PUT', records);
  },

  async bulkDelete(table, ids) {
    return apiCall(`/${table}/bulk`, 'DELETE', { ids });
  },

  // Get all records
  async getAll(table) {
    return apiCall(`/${table}`);
  }
};

// File Upload Examples
const files = {
  async uploadSingle(file) {
    return uploadFile(file);
  },

  async uploadMultiple(files) {
    return uploadFile(files, true);
  }
};

// Usage Examples
async function demo() {
  try {
    // 1. Traditional Login
    const loginResult = await auth.login('admin', 'admin123');
    console.log('Login Result:', loginResult);

    // 2. Register New User
    const registerResult = await auth.register(
      'newuser', 
      'password123', 
      'newuser@example.com'
    );
    console.log('Register Result:', registerResult);

    // 3. OTP Authentication
    await auth.sendOTP('user@example.com');
    const otpResult = await auth.verifyOTP('user@example.com', '123456');
    console.log('OTP Auth Result:', otpResult);

    // 4. CRUD Operations
    // Single record
    const newUser = await crud.create('users', { 
      email: 'newuser@example.com' 
    });
    console.log('Created User:', newUser);

    const user = await crud.read('users', newUser.id);
    console.log('Read User:', user);

    const updatedUser = await crud.update('users', newUser.id, { 
      email: 'updated@example.com' 
    });
    console.log('Updated User:', updatedUser);

    // Bulk operations
    const bulkUsers = await crud.bulkCreate('users', [
      { email: 'bulk1@example.com' },
      { email: 'bulk2@example.com' }
    ]);
    console.log('Bulk Created:', bulkUsers);

    const bulkUpdated = await crud.bulkUpdate('users', [
      { id: 1, email: 'updated1@example.com' },
      { id: 2, email: 'updated2@example.com' }
    ]);
    console.log('Bulk Updated:', bulkUpdated);

    // 5. File Upload
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput.files.length > 0) {
      // Single file upload
      const uploadResult = await files.uploadSingle(fileInput.files[0]);
      console.log('Uploaded File:', uploadResult);

      // Multiple files upload
      const multipleResult = await files.uploadMultiple(fileInput.files);
      console.log('Multiple Files:', multipleResult);
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Export the API helpers
export { auth, crud, files, demo };