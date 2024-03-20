"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { FileType } from "@/typing";
import { TrashIcon, PencilIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAppStore } from "@/store/store";
import { DeleteModal } from "../DeleteModal";
import RenameModal from "../RenameModal";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const [selectedValuesCheckbox, setSelectedValuesCheckBox] = useState<
    string[]
  >([]);

  const [
    setIsDeleteModalOpen,
    setFileId,
    setFilename,
    setIsRenameModalOpen,
    setSelectedValues,
    selectedValues,
    isDeleting,
    setIsDeleting,
  ] = useAppStore((state) => [
    state.setIsDeleteModalOpen,
    state.setFileId,
    state.setFilename,
    state.setIsRenameModalOpen,
    state.setSelectedValues,
    state.selectedValues,
    state.isDeleting,
    state.setIsDeleting,
  ]);

  const openDeleteModal = (fileId: string) => {
    setFileId(fileId);
    setIsDeleteModalOpen(true);
  };

  const openRenameModal = (fileId: string, filename: string) => {
    setFileId(fileId);
    setFilename(filename);
    setIsRenameModalOpen(true);
  };

  const clearStates = () => {
    setSelectedValues([]);
    setSelectedValuesCheckBox([]);
  };

  useEffect(() => {
    setSelectedValues(selectedValuesCheckbox);
  }, [selectedValuesCheckbox, setSelectedValues, isDeleting, selectedValues]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    isDeleting && clearStates();

    isDeleting && setIsDeleting(false);

    if (e.target.checked) {
      setSelectedValuesCheckBox((prevValues) => [...prevValues, value]);
    } else {
      setSelectedValuesCheckBox((prevValues) =>
        prevValues.filter((item) => item !== value)
      );
    }

    setSelectedValues(selectedValuesCheckbox);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                <DeleteModal />
                <RenameModal />

                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {cell.column.id === "timestamp" ? (
                      <div className="flex flex-col">
                        <div className="text-sm">
                          {(cell.getValue() as Date).toLocaleDateString()}
                        </div>

                        <div className="text-xs text-gray-500">
                          {(cell.getValue() as Date).toLocaleTimeString()}
                        </div>
                      </div>
                    ) : cell.column.id === "filename" ? (
                      <p
                        onClick={() =>
                          openRenameModal(
                            (row.original as FileType).id,
                            (row.original as FileType).filename
                          )
                        }
                        className="flex items-center text-black dark:text-white hover:cursor-pointer"
                      >
                        {cell.getValue() as string}{" "}
                        <PencilIcon
                          size={15}
                          className="ml-2 text-emerald-700 dark:text-emerald-600"
                        />
                      </p>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                ))}

                <TableCell key={(row.original as FileType).id}>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      openDeleteModal((row.original as FileType).id);
                      setSelectedValues([]);
                      setSelectedValuesCheckBox([]);
                    }}
                  >
                    <TrashIcon size={20} />
                  </Button>
                </TableCell>

                <TableCell>
                  <input
                    type="checkbox"
                    id={(row.original as FileType).id}
                    value={(row.original as FileType).id}
                    checked={selectedValuesCheckbox.includes(
                      (row.original as FileType).id
                    )}
                    onChange={handleCheckboxChange}
                  />
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                You have no Files Saved in FileDrop.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
