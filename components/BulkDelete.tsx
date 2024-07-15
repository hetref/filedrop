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
import { deleteDoc, doc, getDoc, runTransaction } from "firebase/firestore";
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

    try {
      let totalSizeReduction = 0;

      for (const fileId of selectedValues) {
        const fileRef = ref(storage, `droppers/${user.id}/files/${fileId}`);

        // Delete the file from storage
        await deleteObject(fileRef);

        // Get the file document
        const docing = await getDoc(
          doc(db, "droppers", user.id, "files", fileId)
        );
        if (docing.exists()) {
          const { size: docingSize } = docing.data();
          totalSizeReduction += docingSize;

          // Delete the file document from the database
          await deleteDoc(doc(db, "droppers", user.id, "files", fileId));
        }
      }

      // Run transaction to update total file size
      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(doc(db, "droppers", user.id));
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }

        const newSize = sfDoc.data().size - totalSizeReduction;
        transaction.update(doc(db, "droppers", user.id), { size: newSize });
      });

      toast({
        description: "Files Deleted Successfully!",
      });
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        description: "Error occurred while deleting the files!",
      });
      throw new Error("Error occurred while deleting the files!");
    } finally {
      setIsDeleting(false);
      setSelectedValues([]);
    }
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
