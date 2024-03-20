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

  useEffect(() => {
    if (initialFiles.length === 0) return;

    const totalSize = initialFiles.reduce((acc, file) => acc + file.size, 0);

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
      <div className="flex items-start md:items-end justify-end flex-col">
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
