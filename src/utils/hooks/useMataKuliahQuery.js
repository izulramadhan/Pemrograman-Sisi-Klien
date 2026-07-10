import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useGetMataKuliah = () => {
  return useQuery({
    queryKey: ['matakuliah'],
    queryFn: async () => {
      const response = await api.get('/api/matakuliah');
      return response.data;
    }
  });
};

export const useAddMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newMK) => {
      const response = await api.post('/api/matakuliah', newMK);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matakuliah'] });
    }
  });
};

export const useUpdateMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedMK) => {
      const response = await api.put(`/api/matakuliah/${updatedMK.kode}`, updatedMK);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matakuliah'] });
    }
  });
};

export const useDeleteMataKuliah = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (kode) => {
      const response = await api.delete(`/api/matakuliah/${kode}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matakuliah'] });
    }
  });
};
