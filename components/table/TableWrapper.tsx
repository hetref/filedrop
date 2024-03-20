"use client";

import { FileType } from "@/typing";
import { Button } from "../ui/button";
import { DataTable } from "./Table";
import { columns } from "./columns";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/store";
import { BulkDelete } from "../BulkDelete";

const TableWrapper = ({ skeletonFiles }: { skeletonFiles: FileType[] }) => {
  const { user } = useUser();
  const [initialFiles, setInitialFiles] = useState<FileType[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  const [docs, loading, error] = useCollection(
    user &&
      query(
        collection(db, "droppers", user.id, "files"),
        orderBy("timestamp", sort)
      )
  );

  const setTotalSize = useAppStore((state) => state.setTotalSize);

  const [totalFileSize, setTotalFileSize] = useState<number>(0);
  const [totalFiles, setTotalFiles] = useState<number>(0);

  const [selectedValues, isDeleting, setIsBulkDeletingOpen] = useAppStore(
    (state) => [
      state.selectedValues,
      state.isDeleting,
      state.setIsBulkDeletingOpen,
    ]
  );

  useEffect(() => {
    if (!docs) return;

    const files: FileType[] = docs.docs.map((doc) => ({
      id: doc.id,
      filename: doc.data().filename || doc.id,
      timestamp: new Date(doc.data().timestamp?.seconds * 1000) || undefined,
      fullName: doc.data().fullName,
      downloadUrl: doc.data().downloadUrl,
      type: doc.data().type,
      size: doc.data().size,
    }));

    setInitialFiles(files);
  }, [docs, selectedValues]);

  const isDisabled = () => {
    if (isDeleting) {
      return true;
    } else if (!isDeleting && selectedValues.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  // Get the total size in bytes of the files uploaded by the user
  // initialFiles value:
  // [
  //     {
  //         "id": "n2LwdmP53l2XaiAKUYjQ",
  //         "filename": "Rotate Your Phone_04.png",
  //         "timestamp": "2024-02-10T15:45:11.000Z",
  //         "fullName": "Aryan Shinde",
  //         "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/blaze-plan-account.appspot.com/o/droppers%2Fuser_2ZUvu2vg0SIm90TEVg8jpjcF72M%2Ffiles%2Fn2LwdmP53l2XaiAKUYjQ?alt=media&token=6e370437-9aef-4d15-91e0-852b11640e08",
  //         "type": "image/png",
  //         "size": 15045
  //     },
  //     {
  //         "id": "nnvjkcWlp76uuG260Udw",
  //         "filename": "Products.txt",
  //         "timestamp": "2024-02-07T15:22:39.000Z",
  //         "fullName": "Aryan Shinde",
  //         "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/blaze-plan-account.appspot.com/o/droppers%2Fuser_2ZUvu2vg0SIm90TEVg8jpjcF72M%2Ffiles%2FnnvjkcWlp76uuG260Udw?alt=media&token=556982cd-ae3e-4235-b2f8-9e79105796ec",
  //         "type": "text/plain",
  //         "size": 3355
  //     },
  //     {
  //         "id": "WmrRvLFCfM9QY0yVY2e5",
  //         "filename": "Logo Dark.png",
  //         "timestamp": "2024-02-06T19:31:37.000Z",
  //         "fullName": "Aryan Shinde",
  //         "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/blaze-plan-account.appspot.com/o/droppers%2Fuser_2ZUvu2vg0SIm90TEVg8jpjcF72M%2Ffiles%2FWmrRvLFCfM9QY0yVY2e5?alt=media&token=14ecedc7-08b1-41ab-ae33-6bdd978b479a",
  //         "type": "image/png",
  //         "size": 170662
  //     },
  //     {
  //         "id": "YcLGztOnpnAdrvBnJmRB",
  //         "filename": "Logo Accent.png",
  //         "timestamp": "2024-02-06T19:31:37.000Z",
  //         "fullName": "Aryan Shinde",
  //         "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/blaze-plan-account.appspot.com/o/droppers%2Fuser_2ZUvu2vg0SIm90TEVg8jpjcF72M%2Ffiles%2FYcLGztOnpnAdrvBnJmRB?alt=media&token=2957cb6d-7f12-4fc0-95a6-0f3984f29ea2",
  //         "type": "image/png",
  //         "size": 172769
  //     },
  //     {
  //         "id": "eTz38pAEDTQndFHGPksJ",
  //         "filename": "Logo Accent BG.png",
  //         "timestamp": "2024-02-06T19:31:37.000Z",
  //         "fullName": "Aryan Shinde",
  //         "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/blaze-plan-account.appspot.com/o/droppers%2Fuser_2ZUvu2vg0SIm90TEVg8jpjcF72M%2Ffiles%2FeTz38pAEDTQndFHGPksJ?alt=media&token=615af2d8-1786-43c4-8fdc-0efab55556fb",
  //         "type": "image/png",
  //         "size": 103438
  //     },
  //     {
  //         "id": "wemmhGlIDxmnYwIZmYTA",
  //         "filename": "Logo White.png",
  //         "timestamp": "2024-02-06T19:31:37.000Z",
  //         "fullName": "Aryan Shinde",
  //         "downloadUrl": "https://firebasestorage.googleapis.com/v0/b/blaze-plan-account.appspot.com/o/droppers%2Fuser_2ZUvu2vg0SIm90TEVg8jpjcF72M%2Ffiles%2FwemmhGlIDxmnYwIZmYTA?alt=media&token=64e59ac4-402f-43b4-b50b-ccd495bd5e52",
  //         "type": "image/png",
  //         "size": 171228
  //     }
  // ]

  // I want to get the sum of the sizefrom the intialFiles array and display it in the UI.

  useEffect(() => {
    if (initialFiles.length === 0) return;

    const totalSize = initialFiles.reduce((acc, file) => acc + file.size, 0);
    console.log(Math.ceil(totalSize / 1024));
    // convert the bits into kilobit
    setTotalFileSize(Math.ceil(totalSize / 1024));
    setTotalSize(Math.ceil(totalSize / 1024));
  }, [initialFiles, setTotalSize]);

  if (docs?.docs.length === undefined) {
    return (
      <div className="flex flex-col">
        <Button variant={"outline"} className="ml-auto w-36 h-10 mb-5">
          <Skeleton className="h-5 w-full" />
        </Button>

        <div className="border rounded-lg">
          <div className="border-b h-12" />
          {skeletonFiles.map((file) => (
            <div
              className="flex items-center space-x-4 p-5 w-full"
              key={file.id}
            >
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}

          {skeletonFiles.length === 0 && (
            <div className="flex items-center space-x-4 p-5 w-full">
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-full" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-5 pb-10">
      <div className="flex items-end justify-end flex-col">
        <p>
          <b>Total Files</b>: {initialFiles.length} files
        </p>
        <p>
          <b>Total Size</b>:{" "}
          {totalFileSize < 1024
            ? `${totalFileSize} KB`
            : `${(totalFileSize / 1024).toFixed(2)} MB`}
        </p>
      </div>
      <div className="flex ml-auto">
        <Button
          className="ml-auto w-fit mr-4"
          variant={"outline"}
          onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
        >
          Sort By {sort === "desc" ? "Newest" : "Oldest"}
        </Button>
        <Button
          className="ml-4 w-fit"
          variant={"outline"}
          onClick={() => setIsBulkDeletingOpen(true)}
          disabled={isDisabled()}
        >
          Bulk Delete
        </Button>
        <BulkDelete />
      </div>
      <DataTable columns={columns} data={initialFiles} />
    </div>
  );
};

export default TableWrapper;
