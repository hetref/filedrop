"use client";

import { COLOR_EXTENSION_MAP } from "@/constants";
import { FileType } from "@/typing";
import { ColumnDef } from "@tanstack/react-table";
import { FileIcon, defaultStyles } from "react-file-icon";

export const columns: ColumnDef<FileType>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ renderValue, ...props }) => {
      const type = renderValue() as string;
      const extension: string = type.split("/")[1];
      return (
        <div className="w-10">
          <FileIcon
            extension={extension}
            labelColor={COLOR_EXTENSION_MAP[extension]}
            // @ts-ignore
            {...defaultStyles[extension]}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "filename",
    header: "Filename",
  },
  {
    accessorKey: "timestamp",
    header: "Date Added",
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ renderValue, ...props }) => {
      // return <span>{prettyBytes(renderValue() as number)}</span>;
      return (
        <span>
          {/* {Math.ceil(renderValue() as number) < 1024
            ? `${Math.ceil(renderValue() as number)} KB`
            : `${(Math.ceil(renderValue() as number) / 1024).toFixed(2)} MB`} */}
          {Math.ceil(renderValue() as number) < 1024
            ? `${Math.ceil(renderValue() as number)} B`
            : Math.ceil(renderValue() as number) < 1024 * 1024
            ? `${(Math.ceil(renderValue() as number) / 1024).toFixed(2)} KB`
            : Math.ceil(renderValue() as number) < 1024 * 1024 * 1024
            ? `${(Math.ceil(renderValue() as number) / (1024 * 1024)).toFixed(
                2
              )} MB`
            : `${(
                Math.ceil(renderValue() as number) /
                (1024 * 1024 * 1024)
              ).toFixed(2)} GB`}
        </span>
      );
    },
  },
  {
    accessorKey: "downloadUrl",
    header: "Link",
    cell: ({ renderValue, ...props }) => (
      <a
        href={renderValue() as string}
        target="_blank"
        className="underline tex-blue-500 hover:text-blue-600"
      >
        View / Download
      </a>
    ),
  },
];
