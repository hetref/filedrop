"use client";

import { FileType } from "@/typing";
import { Button } from "../ui/button";
import { DataTable } from "./Table";
import { columns } from "./columns";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { collection, getDoc, orderBy, query, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/store/store";
import { BulkDelete } from "../BulkDelete";

const TableWrapper = ({ skeletonFiles }: { skeletonFiles: FileType[] }) => {
  const { user } = useUser();
  const [initialFiles, setInitialFiles] = useState<FileType[]>([]);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [totalFileSize, setTotalFileSize] = useState<number>(0);

  const [docs, loading, error] = useCollection(
    user &&
      query(
        collection(db, "droppers", user.id, "files"),
        orderBy("timestamp", sort)
      )
  );

  const [userDoc] = useDocument(user && doc(db, "droppers", user.id));

  console.log("USERDOC", userDoc?.data());

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

    setTotalFileSize(Math.max(Math.ceil(userDoc?.data()?.size ?? 0 / 1024), 0));

    setInitialFiles(files);
  }, [docs, selectedValues, userDoc]);

  const isDisabled = () => {
    if (isDeleting) {
      return true;
    } else if (!isDeleting && selectedValues.length === 0) {
      return true;
    } else {
      return false;
    }
  };

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
            ? `${totalFileSize} B`
            : totalFileSize < 1024 * 1024
            ? `${(totalFileSize / 1024).toFixed(2)} KB`
            : totalFileSize < 1024 * 1024 * 1024
            ? `${(totalFileSize / (1024 * 1024)).toFixed(2)} MB`
            : `${(totalFileSize / (1024 * 1024 * 1024)).toFixed(2)} GB`}
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
