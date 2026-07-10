import axios from 'axios';

// --- MOCK DATABASE SEEDING ---
const seedDatabase = () => {
  // 1. Preseed Users
  const users = localStorage.getItem('pemsik_users');
  if (!users || JSON.parse(users).length < 3) {
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

  // 2. Preseed Students (Mahasiswa - 12 items for pagination)
  const mhs = localStorage.getItem('pemsik_students');
  if (!mhs || JSON.parse(mhs).length < 10) {
    localStorage.setItem('pemsik_students', JSON.stringify([
      {
        id: 1,
        nim: "20260001",
        name: "Budi Santoso",
        email: "budi.santoso@mahasiswa.pemsik.ac.id",
        prodi: "Teknik Informatika",
        ipk: "3.85",
        status: true,
        hp: "0812-3456-7890",
        address: "Jl. Merdeka No. 10, Jakarta"
      },
      {
        id: 2,
        nim: "20260002",
        name: "Siti Aminah",
        email: "siti.aminah@mahasiswa.pemsik.ac.id",
        prodi: "Sistem Informasi",
        ipk: "3.62",
        status: true,
        hp: "0823-4567-8901",
        address: "Jl. Sudirman No. 45, Bandung"
      },
      {
        id: 3,
        nim: "20260003",
        name: "Rian Hidayat",
        email: "rian.hidayat@mahasiswa.pemsik.ac.id",
        prodi: "Teknik Komputer",
        ipk: "3.45",
        status: false,
        hp: "0856-7890-1234",
        address: "Jl. Diponegoro No. 89, Surabaya"
      },
      {
        id: 4,
        nim: "20260004",
        name: "Dewi Sartika",
        email: "dewi.sartika@mahasiswa.pemsik.ac.id",
        prodi: "Teknik Informatika",
        ipk: "3.92",
        status: true,
        hp: "0878-9012-3456",
        address: "Jl. Gajah Mada No. 12, Yogyakarta"
      },
      {
        id: 5,
        nim: "20260005",
        name: "Fahri Hamzah",
        email: "fahri.hamzah@mahasiswa.pemsik.ac.id",
        prodi: "Sistem Informasi",
        ipk: "2.98",
        status: true,
        hp: "0899-0123-4567",
        address: "Jl. Hasanuddin No. 3, Makassar"
      },
      {
        id: 6,
        nim: "20260006",
        name: "Ahmad Dahlan",
        email: "ahmad.dahlan@mahasiswa.pemsik.ac.id",
        prodi: "Teknik Komputer",
        ipk: "3.75",
        status: true,
        hp: "0812-7890-1234",
        address: "Jl. Pemuda No. 7, Semarang"
      },
      {
        id: 7,
        nim: "20260007",
        name: "Megawati Soekarno",
        email: "mega.s@mahasiswa.pemsik.ac.id",
        prodi: "Teknik Informatika",
        ipk: "3.10",
        status: false,
        hp: "0821-4567-8901",
        address: "Jl. Teuku Umar No. 29, Jakarta"
      },
      {
        id: 8,
        nim: "20260008",
        name: "Susilo Bambang",
        email: "sby@mahasiswa.pemsik.ac.id",
        prodi: "Sistem Informasi",
        ipk: "3.55",
        status: true,
        hp: "0811-9012-3456",
        address: "Jl. Cikeas Indah No. 1, Bogor"
      },
      {
        id: 9,
        nim: "20260009",
        name: "Joko Widodo",
        email: "jokowi@mahasiswa.pemsik.ac.id",
        prodi: "Teknik Informatika",
        ipk: "3.40",
        status: true,
        hp: "0812-9999-8888",
        address: "Jl. Istana Negara No. 2, Solo"
      },
      {
        id: 10,
        nim: "20260010",
        name: "Prabowo Subianto",
        email: "prabowo@mahasiswa.pemsik.ac.id",
        prodi: "Teknik Komputer",
        ipk: "3.67",
        status: true,
        hp: "0813-1111-2222",
        address: "Jl. Kertanegara No. 4, Jakarta"
      },
      {
        id: 11,
        nim: "20260011",
        name: "Anies Baswedan",
        email: "anies@mahasiswa.pemsik.ac.id",
        prodi: "Sistem Informasi",
        ipk: "3.89",
        status: true,
        hp: "0815-2222-3333",
        address: "Jl. Lebak Bulus Dalam, Jakarta"
      },
      {
        id: 12,
        nim: "20260012",
        name: "Ganjar Pranowo",
        email: "ganjar@mahasiswa.pemsik.ac.id",
        prodi: "Teknik Informatika",
        ipk: "3.52",
        status: false,
        hp: "0817-3333-4444",
        address: "Jl. Kalisari No. 12, Semarang"
      }
    ]));
  }

  // 3. Preseed Dosen (11 items for pagination)
  const dsn = localStorage.getItem('pemsik_dosen');
  if (!dsn || JSON.parse(dsn).length < 10) {
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
      },
      {
        nidn: '0422058804',
        nama: 'Haryanto, Ph.D.',
        email: 'haryanto@pemsik.ac.id',
        keahlian: 'Kecerdasan Buatan',
        status: true
      },
      {
        nidn: '0408078605',
        nama: 'Diana Lestari, M.T.',
        email: 'diana@pemsik.ac.id',
        keahlian: 'Sistem Informasi',
        status: true
      },
      {
        nidn: '0401129006',
        nama: 'Eko Prasetyo, M.Cs.',
        email: 'eko@pemsik.ac.id',
        keahlian: 'Rekayasa Perangkat Lunak',
        status: true
      },
      {
        nidn: '0411118707',
        nama: 'Fitriani, Ph.D.',
        email: 'fitriani@pemsik.ac.id',
        keahlian: 'Data Science',
        status: true
      },
      {
        nidn: '0430098908',
        nama: 'Gunawan, M.T.',
        email: 'gunawan@pemsik.ac.id',
        keahlian: 'Jaringan Komputer',
        status: true
      },
      {
        nidn: '0414028409',
        nama: 'Hendra Wijaya, M.Kom.',
        email: 'hendra@pemsik.ac.id',
        keahlian: 'Kecerdasan Buatan',
        status: false
      },
      {
        nidn: '0425049210',
        nama: 'Indah Permata, M.T.',
        email: 'indah@pemsik.ac.id',
        keahlian: 'Sistem Informasi',
        status: true
      },
      {
        nidn: '0418069311',
        nama: 'Joko Susilo, M.Cs.',
        email: 'joko@pemsik.ac.id',
        keahlian: 'Rekayasa Perangkat Lunak',
        status: true
      }
    ]));
  }

  // 4. Preseed Mata Kuliah (11 items for pagination)
  const mk = localStorage.getItem('pemsik_matakuliah');
  if (!mk || JSON.parse(mk).length < 10) {
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
      },
      {
        kode: 'IF-204',
        nama: 'Jaringan Komputer',
        sks: '3',
        semester: '4',
        sifat: 'Wajib'
      },
      {
        kode: 'IF-205',
        nama: 'Sistem Operasi',
        sks: '3',
        semester: '3',
        sifat: 'Wajib'
      },
      {
        kode: 'IF-206',
        nama: 'Basis Data',
        sks: '4',
        semester: '3',
        sifat: 'Wajib'
      },
      {
        kode: 'IF-207',
        nama: 'Keamanan Informasi',
        sks: '3',
        semester: '7',
        sifat: 'Pilihan'
      },
      {
        kode: 'IF-208',
        nama: 'Grafika Komputer',
        sks: '3',
        semester: '6',
        sifat: 'Pilihan'
      },
      {
        kode: 'IF-209',
        nama: 'Pemrograman Mobile',
        sks: '4',
        semester: '5',
        sifat: 'Wajib'
      },
      {
        kode: 'IF-210',
        nama: 'Interaksi Manusia & Komputer',
        sks: '2',
        semester: '2',
        sifat: 'Wajib'
      },
      {
        kode: 'IF-211',
        nama: 'Etika Profesi',
        sks: '2',
        semester: '8',
        sifat: 'Wajib'
      }
    ]));
  }

  // 5. Preseed Kelas (Classes - 11 items for pagination)
  const kls = localStorage.getItem('pemsik_kelas');
  if (!kls || JSON.parse(kls).length < 10) {
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
      },
      {
        kode: 'K-104',
        nama: 'IF-2A',
        dosenWali: 'Diana Lestari, M.T.',
        jumlahMahasiswa: 30,
        status: true
      },
      {
        kode: 'K-105',
        nama: 'SI-4B',
        dosenWali: 'Eko Prasetyo, M.Cs.',
        jumlahMahasiswa: 26,
        status: true
      },
      {
        kode: 'K-106',
        nama: 'TK-2A',
        dosenWali: 'Gunawan, M.T.',
        jumlahMahasiswa: 22,
        status: true
      },
      {
        kode: 'K-107',
        nama: 'IF-6B',
        dosenWali: 'Haryanto, Ph.D.',
        jumlahMahasiswa: 29,
        status: true
      },
      {
        kode: 'K-108',
        nama: 'SI-6A',
        dosenWali: 'Indah Permata, M.T.',
        jumlahMahasiswa: 25,
        status: false
      },
      {
        kode: 'K-109',
        nama: 'TK-4B',
        dosenWali: 'Joko Susilo, M.Cs.',
        jumlahMahasiswa: 20,
        status: true
      },
      {
        kode: 'K-110',
        nama: 'IF-8A',
        dosenWali: 'Diana Lestari, M.T.',
        jumlahMahasiswa: 15,
        status: true
      },
      {
        kode: 'K-111',
        nama: 'SI-8B',
        dosenWali: 'Budi Santoso, M.Kom.',
        jumlahMahasiswa: 12,
        status: true
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

// Execute seeding
seedDatabase();

// Create Axios Instance
const api = axios.create({
  baseURL: '',
  adapter: mockAdapter // Intercept all requests with mock REST handler
});

export default api;
