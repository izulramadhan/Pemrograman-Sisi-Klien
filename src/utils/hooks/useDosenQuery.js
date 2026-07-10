import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';

export const useGetDosen = () => {
  return useQuery({
    queryKey: ['dosen'],
    queryFn: async () => {
      const response = await api.get('/api/dosen');
      return response.data;
    }
  });
};

export const useAddDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newDosen) => {
      const response = await api.post('/api/dosen', newDosen);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dosen'] });
    }
  });
};

export const useUpdateDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedDosen) => {
      const response = await api.put(`/api/dosen/${updatedDosen.nidn}`, updatedDosen);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dosen'] });
    }
  });
};

export const useDeleteDosen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (nidn) => {
      const response = await api.delete(`/api/dosen/${nidn}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dosen'] });
    }
  });
};
