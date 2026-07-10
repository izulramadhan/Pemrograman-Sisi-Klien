import axios from 'axios';

// --- MOCK DATABASE SEEDING ---
const seedDatabase = () => {
  // 1. Preseed Users
  if (!localStorage.getItem('pemsik_users')) {
    localStorage.setItem('pemsik_users', JSON.stringify([
      {
        username: 'admin',
        password: 'password123',
        name: 'Azizul Izul',
        email: 'admin@pemsik.com',
        role: 'Super Admin',
        permissions: ['read', 'write', 'delete'],
        avatar: ''
      },
      {
        username: 'dosen',
        password: 'dosenpassword',
        name: 'Dr. Ir. Budi Santoso',
        email: 'budi.santoso@pemsik.com',
        role: 'Dosen',
        permissions: ['read', 'write'],
        avatar: ''
      },
      {
        username: 'viewer',
        password: 'viewerpassword',
        name: 'Siti Rahma',
        email: 'siti.rahma@pemsik.com',
        role: 'Viewer',
        permissions: ['read'],
        avatar: ''
      }
    ]));
  }

  // 2. Preseed Dosen
  if (!localStorage.getItem('pemsik_dosen')) {
    localStorage.setItem('pemsik_dosen', JSON.stringify([
      {
        nidn: '0412038501',
        nama: 'Dr. Ir. Azizul Izul, M.T.',
        email: 'izul@pemsik.ac.id',
        keahlian: 'Rekayasa Perangkat Lunak',
        status: true
      },
      {
        nidn: '0415088902',
        nama: 'Budi Santoso, M.Kom.',
        email: 'budi@pemsik.ac.id',
        keahlian: 'Data Science',
        status: true
      },
      {
        nidn: '0419119103',
        nama: 'Siti Aminah, M.T.',
        email: 'siti@pemsik.ac.id',
        keahlian: 'Jaringan Komputer',
        status: false
      }
    ]));
  }

  // 3. Preseed Mata Kuliah
  if (!localStorage.getItem('pemsik_matakuliah')) {
    localStorage.setItem('pemsik_matakuliah', JSON.stringify([
      {
        kode: 'IF-201',
        nama: 'Pemrograman Web',
        sks: '3',
        semester: '4',
        sifat: 'Wajib'
      },
      {
        kode: 'IF-202',
        nama: 'Kecerdasan Buatan',
        sks: '3',
        semester: '5',
        sifat: 'Pilihan'
      },
      {
        kode: 'IF-203',
        nama: 'Rekayasa Perangkat Lunak',
        sks: '4',
        semester: '6',
        sifat: 'Wajib'
      }
    ]));
  }
};

// Execute seeding
seedDatabase();

// --- AXIOS CUSTOM MOCK ADAPTER ---
const mockAdapter = async (config) => {
  // Simulate network latency (150ms - 300ms)
  await new Promise((resolve) => setTimeout(resolve, 150 + Math.random() * 150));

  const { url, method, data } = config;
  const parsedData = data ? JSON.parse(data) : null;

  // 1. REGISTRASI USER (POST /api/auth/register)
  if (url === '/api/auth/register' && method === 'post') {
    const users = JSON.parse(localStorage.getItem('pemsik_users') || '[]');
    const { name, username, email, password, role } = parsedData;

    // Validation checks
    if (!name || !username || !email || !password) {
      return {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
        data: { message: 'Semua kolom wajib diisi!' }
      };
    }

    const usernameExists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
    if (usernameExists) {
      return {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
        data: { message: 'Username sudah digunakan!' }
      };
    }

    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
        data: { message: 'Email sudah terdaftar!' }
      };
    }

    // Map default permissions based on chosen role
    let permissions = ['read'];
    if (role === 'Super Admin') {
      permissions = ['read', 'write', 'delete'];
    } else if (role === 'Dosen') {
      permissions = ['read', 'write'];
    }

    const newUser = { name, username, email, password, role: role || 'Viewer', permissions, avatar: '' };
    users.push(newUser);
    localStorage.setItem('pemsik_users', JSON.stringify(users));

    return {
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
      data: { success: true, message: 'Registrasi berhasil!' }
    };
  }

  // 2. LOGIN USER (POST /api/auth/login)
  if (url === '/api/auth/login' && method === 'post') {
    const users = JSON.parse(localStorage.getItem('pemsik_users') || '[]');
    const { username, password } = parsedData;

    const matchedUser = users.find(
      u => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );

    if (matchedUser) {
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: { success: true, user: matchedUser }
      };
    } else {
      return {
        status: 401,
        statusText: 'Unauthorized',
        headers: {},
        config,
        data: { message: 'Username atau password salah!' }
      };
    }
  }

  // 3. GET ALL USERS (GET /api/users)
  if (url === '/api/users' && method === 'get') {
    const users = JSON.parse(localStorage.getItem('pemsik_users') || '[]');
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: users
    };
  }

  // 4. UPDATE USER ROLE & PERMISSIONS (PUT /api/users/:username)
  if (url.startsWith('/api/users/') && method === 'put') {
    const username = url.split('/').pop().toLowerCase();
    const users = JSON.parse(localStorage.getItem('pemsik_users') || '[]');
    const { role, permissions } = parsedData;

    const index = users.findIndex(u => u.username.toLowerCase() === username);
    if (index !== -1) {
      users[index] = {
        ...users[index],
        role,
        permissions: permissions || ['read']
      };
      localStorage.setItem('pemsik_users', JSON.stringify(users));
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: users[index]
      };
    } else {
      return {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
        data: { message: 'User tidak ditemukan!' }
      };
    }
  }

  // 5. GET DOSEN (GET /api/dosen)
  if (url === '/api/dosen' && method === 'get') {
    const dosen = JSON.parse(localStorage.getItem('pemsik_dosen') || '[]');
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: dosen
    };
  }

  // 6. ADD DOSEN (POST /api/dosen)
  if (url === '/api/dosen' && method === 'post') {
    const dosen = JSON.parse(localStorage.getItem('pemsik_dosen') || '[]');
    const newDosen = parsedData;

    const nidnExists = dosen.some(d => d.nidn === newDosen.nidn);
    if (nidnExists) {
      return {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
        data: { message: 'NIDN sudah terdaftar!' }
      };
    }

    dosen.unshift(newDosen);
    localStorage.setItem('pemsik_dosen', JSON.stringify(dosen));

    return {
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
      data: newDosen
    };
  }

  // 7. UPDATE DOSEN (PUT /api/dosen/:nidn)
  if (url.startsWith('/api/dosen/') && method === 'put') {
    const nidn = url.split('/').pop();
    const dosen = JSON.parse(localStorage.getItem('pemsik_dosen') || '[]');
    const updatedDosen = parsedData;

    const index = dosen.findIndex(d => d.nidn === nidn);
    if (index !== -1) {
      dosen[index] = { ...dosen[index], ...updatedDosen };
      localStorage.setItem('pemsik_dosen', JSON.stringify(dosen));
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: dosen[index]
      };
    } else {
      return {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
        data: { message: 'Dosen tidak ditemukan!' }
      };
    }
  }

  // 8. DELETE DOSEN (DELETE /api/dosen/:nidn)
  if (url.startsWith('/api/dosen/') && method === 'delete') {
    const nidn = url.split('/').pop();
    const dosen = JSON.parse(localStorage.getItem('pemsik_dosen') || '[]');

    const filtered = dosen.filter(d => d.nidn !== nidn);
    localStorage.setItem('pemsik_dosen', JSON.stringify(filtered));

    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: { success: true }
    };
  }

  // 9. GET MATA KULIAH (GET /api/matakuliah)
  if (url === '/api/matakuliah' && method === 'get') {
    const matakuliah = JSON.parse(localStorage.getItem('pemsik_matakuliah') || '[]');
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: matakuliah
    };
  }

  // 10. ADD MATA KULIAH (POST /api/matakuliah)
  if (url === '/api/matakuliah' && method === 'post') {
    const matakuliah = JSON.parse(localStorage.getItem('pemsik_matakuliah') || '[]');
    const newMK = parsedData;

    const codeExists = matakuliah.some(m => m.kode.toLowerCase() === newMK.kode.toLowerCase());
    if (codeExists) {
      return {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
        data: { message: 'Kode Mata Kuliah sudah terdaftar!' }
      };
    }

    matakuliah.unshift(newMK);
    localStorage.setItem('pemsik_matakuliah', JSON.stringify(matakuliah));

    return {
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
      data: newMK
    };
  }

  // 11. UPDATE MATA KULIAH (PUT /api/matakuliah/:kode)
  if (url.startsWith('/api/matakuliah/') && method === 'put') {
    const kode = url.split('/').pop();
    const matakuliah = JSON.parse(localStorage.getItem('pemsik_matakuliah') || '[]');
    const updatedMK = parsedData;

    const index = matakuliah.findIndex(m => m.kode.toLowerCase() === kode.toLowerCase());
    if (index !== -1) {
      matakuliah[index] = { ...matakuliah[index], ...updatedMK };
      localStorage.setItem('pemsik_matakuliah', JSON.stringify(matakuliah));
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: matakuliah[index]
      };
    } else {
      return {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
        data: { message: 'Mata Kuliah tidak ditemukan!' }
      };
    }
  }

  // 12. DELETE MATA KULIAH (DELETE /api/matakuliah/:kode)
  if (url.startsWith('/api/matakuliah/') && method === 'delete') {
    const kode = url.split('/').pop();
    const matakuliah = JSON.parse(localStorage.getItem('pemsik_matakuliah') || '[]');

    const filtered = matakuliah.filter(m => m.kode.toLowerCase() !== kode.toLowerCase());
    localStorage.setItem('pemsik_matakuliah', JSON.stringify(filtered));

    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: { success: true }
    };
  }

  // Fallback error for unknown endpoints
  throw new Error(`Endpoint mock [${method.toUpperCase()}] ${url} tidak terdaftar!`);
};

// Create Axios Instance
const api = axios.create({
  baseURL: '',
  adapter: mockAdapter // Intercept all requests with mock REST handler
});

export default api;
