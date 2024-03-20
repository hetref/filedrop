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
export function DeleteModal() {
  const { user } = useUser();
  const [setIsDeleteModalOpen, isDeleteModalOpen, fileId, setFilename] =
    useAppStore((state) => [
      state.setIsDeleteModalOpen,
      state.isDeleteModalOpen,
      state.fileId,
      state.setFilename,
    ]);
  const { toast } = useToast();

  const deleteFile = async () => {
    if (!user || !fileId) return;
    const fileRef = ref(storage, `droppers/${user.id}/files/${fileId}`);

    try {
      deleteObject(fileRef)
        .then(async () => {
          deleteDoc(doc(db, "droppers", user.id, "files", fileId)).then(() => {
            toast({
              description: "File Deleted Successfully!",
            });
          });
        })
        .finally(() => {
          setIsDeleteModalOpen(false);
        });
    } catch (error) {
      console.log(error);
      setIsDeleteModalOpen(false);

      toast({
        variant: "destructive",
        description: "Error occured while deleting the file!",
      });
    }
  };

  return (
    <Dialog
      open={isDeleteModalOpen}
      onOpenChange={(isOpen) => setIsDeleteModalOpen(isOpen)}
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
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <span className="sr-only">Cancel</span>
            <span>Cancel</span>
          </Button>

          <Button
            type="submit"
            size="sm"
            variant={"destructive"}
            className="px-3 flex-1"
            onClick={() => deleteFile()}
          >
            <span className="sr-only">Delete</span>
            <span>Delete</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
