import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Customer, Vendor, InventoryItem, RentalOrder } from '../backend';

// Customers
export function useGetCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: Customer) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCustomer(customer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ npwp, customer }: { npwp: string; customer: Customer }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCustomer(npwp, customer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useDeleteCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (npwp: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCustomer(npwp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// Vendors
export function useGetVendors() {
  const { actor, isFetching } = useActor();

  return useQuery<Vendor[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVendors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vendor: Vendor) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVendor(vendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

export function useUpdateVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ npwp, vendor }: { npwp: string; vendor: Vendor }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateVendor(npwp, vendor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

export function useDeleteVendor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (npwp: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVendor(npwp);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

// Inventory
export function useGetInventoryItems() {
  const { actor, isFetching } = useActor();

  return useQuery<InventoryItem[]>({
    queryKey: ['inventory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInventoryItems();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddInventoryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: InventoryItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addInventoryItem(item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useUpdateInventoryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, item }: { itemId: string; item: InventoryItem }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateInventoryItem(itemId, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useDeleteInventoryItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteInventoryItem(itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

// Rental Orders
export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<RentalOrder[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: RentalOrder) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, order }: { orderId: string; order: RentalOrder }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateOrder(orderId, order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useDeleteOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteOrder(orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
