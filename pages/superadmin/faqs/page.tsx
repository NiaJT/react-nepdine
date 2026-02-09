"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { IFAQ, useGetFAQs } from "@/hooks/superAdmin/useFAQ";

export default function FAQTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetFAQs(page);
  const [selectedFAQ, setSelectedFAQ] = useState<IFAQ | null>(null);

  const handleDelete = (id: string) => {
    console.log("Deleting FAQ with id:", id);
  };

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500">Loading FAQs...</div>
    );
  }

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4">FAQs</h1>
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white rounded-2xl shadow-md border border-gray-100 border-separate border-spacing-y-2 p-2">
          <TableHeader>
            <TableRow className="bg-gray-50 text-gray-700">
              <TableHead className="font-semibold text-sm py-3">
                Question
              </TableHead>
              <TableHead className="font-semibold text-sm py-3">Date</TableHead>
              <TableHead className="font-semibold text-sm py-3 text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data && data.length > 0 ? (
              data.map((faq: IFAQ) => (
                <TableRow
                  key={faq.id}
                  className="bg-white hover:bg-gray-50 shadow-sm border border-gray-100 rounded-lg"
                >
                  <TableCell className="py-3 px-4 text-gray-800 font-medium max-w-[400px] truncate">
                    {faq.question.length > 50
                      ? faq.question.slice(0, 50) + "..."
                      : faq.question}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-600">
                    {new Date(faq.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-4 flex justify-center items-center gap-2">
                    {/* View Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50 rounded-full"
                          onClick={() => setSelectedFAQ(faq)}
                        >
                          <Icon icon="mdi:eye-outline" width={18} height={18} />
                        </Button>
                      </DialogTrigger>

                      {selectedFAQ && selectedFAQ.id === faq.id && (
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold mb-2">
                              FAQ Details
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                              Full details for the selected FAQ
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 space-y-3 text-gray-800">
                            <p>
                              <strong>Question:</strong> {selectedFAQ.question}
                            </p>
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date(
                                selectedFAQ.created_at
                              ).toLocaleString()}
                            </p>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 rounded-full"
                      onClick={() => handleDelete(faq.id)}
                    >
                      <Icon
                        icon="icon-park-outline:delete"
                        width={18}
                        height={18}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-gray-500 py-6"
                >
                  No FAQs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1 || isFetching}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span className="text-gray-600 text-sm">Page {page}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={data && data.length < 10}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
