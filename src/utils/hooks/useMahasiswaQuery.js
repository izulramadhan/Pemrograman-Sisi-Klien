import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useGetMahasiswa = () => {
  return useQuery({
    queryKey: ['mahasiswa'],
    queryFn: async () => {
      const response = await api.get('/api/mahasiswa');
      return response.data;
    }
  });
};

export const useAddMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMhs) => {
      const response = await api.post('/api/mahasiswa', newMhs);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mahasiswa'] });
    }
  });
};

export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedMhs) => {
      const response = await api.put(`/api/mahasiswa/${updatedMhs.nim}`, updatedMhs);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mahasiswa'] });
    }
  });
};

export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nim) => {
      const response = await api.delete(`/api/mahasiswa/${nim}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mahasiswa'] });
    }
  });
};
