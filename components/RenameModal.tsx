"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAppStore } from "@/store/store";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useToast } from "./ui/use-toast";

const RenameModal = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [setIsRenameModalOpen, isRenameModalOpen, fileId, filename] =
    useAppStore((state) => [
      state.setIsRenameModalOpen,
      state.isRenameModalOpen,
      state.fileId,
      state.filename,
    ]);

  const { toast } = useToast();

  const renameFile = async () => {
    if (!user || !fileId) return;

    await updateDoc(doc(db, "droppers", user.id, "files", fileId), {
      filename: input,
    })
      .then(() => {
        toast({
          description: "File Renamed Successfully!",
        });
      })
      .catch((error) => {
        console.log(error);
        toast({
          variant: "destructive",
          description: "Error occured while renaming the file!",
        });
      });

    setInput("");
    setIsRenameModalOpen(false);
  };

  return (
    <Dialog
      open={isRenameModalOpen}
      onOpenChange={(isOpen) => setIsRenameModalOpen(isOpen)}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename the File!</DialogTitle>
        </DialogHeader>

        <Input
          id="link"
          defaultValue={filename}
          onChange={(e) => setInput(e.target.value)}
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") {
              renameFile();
            }
          }}
        />

        <div className="flex justify-end space-x-2 py-3">
          <Button
            size="sm"
            className="px-3"
            variant={"ghost"}
            onClick={() => setIsRenameModalOpen(false)}
          >
            <span className="sr-only">Cancel</span>
            <span>Cancel</span>
          </Button>

          <Button
            type="submit"
            size="sm"
            className="px-3 flex-1"
            onClick={() => renameFile()}
          >
            <span className="sr-only">Rename</span>
            <span>Rename</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenameModal;
