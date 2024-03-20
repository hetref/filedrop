"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useToast } from "./ui/use-toast";
export function BulkDelete() {
  const { user } = useUser();
  const [
    setIsDeleteModalOpen,
    isDeleteModalOpen,
    setIsDeleting,
    setSelectedValues,
    selectedValues,
    isBulkDeletingOpen,
    setIsBulkDeletingOpen,
  ] = useAppStore((state) => [
    state.setIsDeleteModalOpen,
    state.isDeleteModalOpen,
    state.setIsDeleting,
    state.setSelectedValues,
    state.selectedValues,
    state.isBulkDeletingOpen,
    state.setIsBulkDeletingOpen,
  ]);
  const { toast } = useToast();

  const bulkDelete = async (selectedValues: string[]) => {
    if (!user) return;

    setIsDeleting(true);
    setIsBulkDeletingOpen(false);

    selectedValues.map((fileId) => {
      const fileRef = ref(storage, `droppers/${user.id}/files/${fileId}`);

      try {
        deleteObject(fileRef).then(async () => {
          deleteDoc(doc(db, "droppers", user.id, "files", fileId)).then(() => {
            toast({
              description: "Files Deleted Successfully!",
            });
          });
        });
      } catch (error) {
        console.log(error);

        toast({
          variant: "destructive",
          description: "Error occured while deleting the file!",
        });
      }
    });

    setSelectedValues([]);
  };

  return (
    <Dialog
      open={isBulkDeletingOpen}
      onOpenChange={(isOpen) => setIsBulkDeletingOpen(isOpen)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Please confirm the operation!</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            file!
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-2 py-3">
          <Button
            size="sm"
            className="px-3 flex-1"
            variant={"ghost"}
            onClick={() => setIsBulkDeletingOpen(false)}
          >
            <span className="sr-only">Cancel</span>
            <span>Cancel</span>
          </Button>

          <Button
            type="submit"
            size="sm"
            variant={"destructive"}
            className="px-3 flex-1"
            onClick={() => bulkDelete(selectedValues)}
          >
            <span className="sr-only">Delete Files</span>
            <span>Delete Files</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
