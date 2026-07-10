import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useGetKelas = () => {
  return useQuery({
    queryKey: ['kelas'],
    queryFn: async () => {
      const response = await api.get('/api/kelas');
      return response.data;
    }
  });
};

export const useAddKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newKelas) => {
      const response = await api.post('/api/kelas', newKelas);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    }
  });
};

export const useUpdateKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedKelas) => {
      const response = await api.put(`/api/kelas/${updatedKelas.kode}`, updatedKelas);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    }
  });
};

export const useDeleteKelas = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (kode) => {
      const response = await api.delete(`/api/kelas/${kode}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kelas'] });
    }
  });
};
