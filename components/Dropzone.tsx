"use client";

import { db, storage } from "@/firebase";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import {
  addDoc,
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import DropzoneComponent from "react-dropzone";
import { useToast } from "./ui/use-toast";

const Dropzone = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  const maxSize = 20971520;
  // const maxSize = 999423;

  const onDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => {
        toast({
          variant: "destructive",
          title: "File Uploading Error!",
          description: "File reading was aborted.",
        });
      };
      reader.onerror = () =>
        toast({
          variant: "destructive",
          title: "File Uploading Error!",
          description: "File reading has failed.",
        });
      reader.onload = async () => await uploadPost(file);
      reader.readAsArrayBuffer(file);
    });
  };

  const uploadPost = async (selectedFile: File) => {
    if (loading) return;
    if (!user) return;
    setLoading(true);
    let isTotalTooLarge = false;

    console.log("FILE", selectedFile);

    try {
      await runTransaction(db, async (transaction) => {
        const dropperDoc = await transaction.get(doc(db, "droppers", user.id));
        if (!dropperDoc.exists()) {
          throw "Document does not exist!";
        }

        const newSize = (dropperDoc.data()?.size || 0) + selectedFile.size;

        if (newSize > maxSize) {
          console.log("LOADING FALSE");
          isTotalTooLarge = true;
          toast({
            variant: "destructive",
            title: "File Size Limit Exceeded!",
            description: "You have reached the maximum file size limit.",
          });
          return;
        }

        transaction.update(doc(db, "droppers", user.id), {
          size: newSize,
        });
      })
        .then(() => {
          console.log("Transaction successfully committed!");
        })
        .catch((error) => {
          console.log("Transaction failed: ", error);
          toast({
            title: "Cannot upload the document!",
          });
          setLoading(false);
          return;
        });

      if (isTotalTooLarge) {
        console.log("PLEASE UPGRADE THE LIMIT TO UPLOAD MORE!");
        return;
      }

      // addDoc -> users/user1234/files
      const docRef = await addDoc(
        collection(db, "droppers", user.id, "files"),
        {
          userId: user.id,
          filename: selectedFile.name,
          fullName: user.fullName,
          profileImg: user.imageUrl,
          timestamp: serverTimestamp(),
          type: selectedFile.type,
          size: selectedFile.size,
        }
      );

      const imageRef = ref(storage, `droppers/${user.id}/files/${docRef.id}`);

      uploadBytes(imageRef, selectedFile).then(async (snapshot) => {
        const downloadUrl = await getDownloadURL(imageRef);

        await updateDoc(doc(db, "droppers", user.id, "files", docRef.id), {
          downloadUrl,
        });
      });

      toast({
        description: "File Uploaded Successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong!",
      });
    }

    setLoading(false);
  };

  return (
    <DropzoneComponent minSize={0} maxSize={maxSize} onDrop={onDrop}>
      {({
        getRootProps,
        getInputProps,
        isDragActive,
        isDragReject,
        fileRejections,
      }) => {
        const isFileTooLarge =
          fileRejections.length > 0 && fileRejections[0].file.size > maxSize;
        return (
          <section className="m-6">
            <div
              {...getRootProps()}
              className={cn(
                "w-full h-52 flex justify-center items-center p-5 border border-dashed rounded-lg text-center",
                isDragActive
                  ? "bg-[#035FFE] text-white animate-pulse"
                  : "bg-slate-100/50 dark:bg-slate-800/80 text-slate-400"
              )}
            >
              <input {...getInputProps()} />
              {!isDragActive && "Click or drag files here"}
              {isDragActive && !isDragReject && "Drop to upload this file!"}
              {isDragReject && "File type not accepted, sorry!"}
              {isFileTooLarge && (
                <div className="text-danger mt-2">
                  File is too large, upgrade to pro!
                </div>
              )}
            </div>
          </section>
        );
      }}
    </DropzoneComponent>
  );
};

export default Dropzone;
