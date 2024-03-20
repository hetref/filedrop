import { create } from "zustand";

interface AppState {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;

  isRenameModalOpen: boolean;
  setIsRenameModalOpen: (open: boolean) => void;

  isDeleting: boolean;
  setIsDeleting: (open: boolean) => void;

  isBulkDeletingOpen: boolean;
  setIsBulkDeletingOpen: (open: boolean) => void;

  fileId: string | null;
  setFileId: (fileId: string) => void;

  filename: string;
  setFilename: (filename: string) => void;

  selectedValues: string[];
  setSelectedValues: (selectedValues: string[]) => void;

  totalSize: number;
  setTotalSize: (size: number) => void;
}

export const useAppStore = create<AppState>()((set) => ({
  fileId: null,
  setFileId: (fileId: string) => set((state) => ({ fileId })),

  filename: "",
  setFilename: (filename: string) => set((state) => ({ filename })),

  isDeleteModalOpen: false,
  setIsDeleteModalOpen: (open) => set((state) => ({ isDeleteModalOpen: open })),

  isBulkDeletingOpen: false,
  setIsBulkDeletingOpen: (open) =>
    set((state) => ({ isBulkDeletingOpen: open })),

  isDeleting: false,
  setIsDeleting: (status) => set((state) => ({ isDeleting: status })),

  isRenameModalOpen: false,
  setIsRenameModalOpen: (open) => set((state) => ({ isRenameModalOpen: open })),

  selectedValues: [],
  setSelectedValues: (values: string[]) =>
    set((state) => ({ selectedValues: values })),

  totalSize: -1,
  setTotalSize: (size: number) => set((state) => ({ totalSize: size })),
}));
