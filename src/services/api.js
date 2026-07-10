import axios from 'axios';
import initialStudents from '../data/students.json';

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

  // 2. Preseed Students (Mahasiswa)
  if (!localStorage.getItem('pemsik_students')) {
    localStorage.setItem('pemsik_students', JSON.stringify(initialStudents));
  }

  // 3. Preseed Dosen
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

  // 4. Preseed Mata Kuliah
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

  // 5. Preseed Kelas (Classes)
  if (!localStorage.getItem('pemsik_kelas')) {
    localStorage.setItem('pemsik_kelas', JSON.stringify([
      {
        kode: 'K-101',
        nama: 'IF-4A',
        dosenWali: 'Dr. Ir. Azizul Izul, M.T.',
        jumlahMahasiswa: 28,
        status: true
      },
      {
        kode: 'K-102',
        nama: 'SI-2B',
        dosenWali: 'Budi Santoso, M.Kom.',
        jumlahMahasiswa: 24,
        status: true
      },
      {
        kode: 'K-103',
        nama: 'TK-6C',
        dosenWali: 'Siti Aminah, M.T.',
        jumlahMahasiswa: 18,
        status: false
      }
    ]));
  }
};

// Execute seeding
seedDatabase();

// --- AXIOS CUSTOM MOCK ADAPTER ---
const mockAdapter = async (config) => {
  // Simulate network latency (100ms - 200ms)
  await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 100));

  const { url, method, data } = config;
  const parsedData = data ? JSON.parse(data) : null;

  // 1. REGISTRASI USER (POST /api/auth/register)
  if (url === '/api/auth/register' && method === 'post') {
    const users = JSON.parse(localStorage.getItem('pemsik_users') || '[]');
    const { name, username, email, password, role } = parsedData;

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

  // 5. GET MAHASISWA (GET /api/mahasiswa)
  if (url === '/api/mahasiswa' && method === 'get') {
    const mhs = JSON.parse(localStorage.getItem('pemsik_students') || '[]');
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: mhs
    };
  }

  // 6. ADD MAHASISWA (POST /api/mahasiswa)
  if (url === '/api/mahasiswa' && method === 'post') {
    const mhs = JSON.parse(localStorage.getItem('pemsik_students') || '[]');
    const newMhs = parsedData;

    const nimExists = mhs.some(s => s.nim.toString().trim() === newMhs.nim.toString().trim());
    if (nimExists) {
      return {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
        data: { message: 'NIM sudah terdaftar!' }
      };
    }

    mhs.unshift(newMhs);
    localStorage.setItem('pemsik_students', JSON.stringify(mhs));

    return {
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
      data: newMhs
    };
  }

  // 7. UPDATE MAHASISWA (PUT /api/mahasiswa/:nim)
  if (url.startsWith('/api/mahasiswa/') && method === 'put') {
    const nim = url.split('/').pop().trim();
    const mhs = JSON.parse(localStorage.getItem('pemsik_students') || '[]');
    const updatedMhs = parsedData;

    const index = mhs.findIndex(s => s.nim.toString().trim() === nim);
    if (index !== -1) {
      mhs[index] = { ...mhs[index], ...updatedMhs };
      localStorage.setItem('pemsik_students', JSON.stringify(mhs));
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: mhs[index]
      };
    } else {
      return {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
        data: { message: 'Mahasiswa tidak ditemukan!' }
      };
    }
  }

  // 8. DELETE MAHASISWA (DELETE /api/mahasiswa/:nim)
  if (url.startsWith('/api/mahasiswa/') && method === 'delete') {
    const nim = url.split('/').pop().trim();
    const mhs = JSON.parse(localStorage.getItem('pemsik_students') || '[]');

    const filtered = mhs.filter(s => s.nim.toString().trim() !== nim);
    localStorage.setItem('pemsik_students', JSON.stringify(filtered));

    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: { success: true }
    };
  }

  // 9. GET DOSEN (GET /api/dosen)
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

  // 10. ADD DOSEN (POST /api/dosen)
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

  // 11. UPDATE DOSEN (PUT /api/dosen/:nidn)
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

  // 12. DELETE DOSEN (DELETE /api/dosen/:nidn)
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

  // 13. GET MATA KULIAH (GET /api/matakuliah)
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

  // 14. ADD MATA KULIAH (POST /api/matakuliah)
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

  // 15. UPDATE MATA KULIAH (PUT /api/matakuliah/:kode)
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

  // 16. DELETE MATA KULIAH (DELETE /api/matakuliah/:kode)
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

  // 17. GET KELAS (GET /api/kelas)
  if (url === '/api/kelas' && method === 'get') {
    const kelas = JSON.parse(localStorage.getItem('pemsik_kelas') || '[]');
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: kelas
    };
  }

  // 18. ADD KELAS (POST /api/kelas)
  if (url === '/api/kelas' && method === 'post') {
    const kelas = JSON.parse(localStorage.getItem('pemsik_kelas') || '[]');
    const newKelas = parsedData;

    const codeExists = kelas.some(k => k.kode.toLowerCase() === newKelas.kode.toLowerCase());
    if (codeExists) {
      return {
        status: 400,
        statusText: 'Bad Request',
        headers: {},
        config,
        data: { message: 'Kode Kelas sudah terdaftar!' }
      };
    }

    kelas.unshift(newKelas);
    localStorage.setItem('pemsik_kelas', JSON.stringify(kelas));

    return {
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
      data: newKelas
    };
  }

  // 19. UPDATE KELAS (PUT /api/kelas/:kode)
  if (url.startsWith('/api/kelas/') && method === 'put') {
    const kode = url.split('/').pop();
    const kelas = JSON.parse(localStorage.getItem('pemsik_kelas') || '[]');
    const updatedKelas = parsedData;

    const index = kelas.findIndex(k => k.kode.toLowerCase() === kode.toLowerCase());
    if (index !== -1) {
      kelas[index] = { ...kelas[index], ...updatedKelas };
      localStorage.setItem('pemsik_kelas', JSON.stringify(kelas));
      return {
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        data: kelas[index]
      };
    } else {
      return {
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config,
        data: { message: 'Kelas tidak ditemukan!' }
      };
    }
  }

  // 20. DELETE KELAS (DELETE /api/kelas/:kode)
  if (url.startsWith('/api/kelas/') && method === 'delete') {
    const kode = url.split('/').pop();
    const kelas = JSON.parse(localStorage.getItem('pemsik_kelas') || '[]');

    const filtered = kelas.filter(k => k.kode.toLowerCase() !== kode.toLowerCase());
    localStorage.setItem('pemsik_kelas', JSON.stringify(filtered));

    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: { success: true }
    };
  }

  throw new Error(`Endpoint mock [${method.toUpperCase()}] ${url} tidak terdaftar!`);
};

// Create Axios Instance
const api = axios.create({
  baseURL: '',
  adapter: mockAdapter // Intercept all requests with mock REST handler
});

export default api;
