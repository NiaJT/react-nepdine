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
import {
  useDeleteFeedback,
  useGetFeedbacks,
} from "@/hooks/superAdmin/useFeedback";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export interface Feedback {
  id: string;
  full_name: string;
  email: string;
  description: string;
  created_at: string;
}

export default function FeedbackTable() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetFeedbacks(page);
  const deleteMutation = useDeleteFeedback();
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500">Loading feedbacks...</div>
    );
  }

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4">Feedbacks</h1>
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white rounded-2xl shadow-md border border-gray-100 border-separate border-spacing-y-2 p-2">
          <TableHeader>
            <TableRow className="bg-gray-50 text-gray-700">
              <TableHead className="font-semibold text-sm py-3">
                Full Name
              </TableHead>
              <TableHead className="font-semibold text-sm py-3">
                Email
              </TableHead>
              <TableHead className="font-semibold text-sm py-3">
                Description
              </TableHead>
              <TableHead className="font-semibold text-sm py-3">Date</TableHead>
              <TableHead className="font-semibold text-sm py-3 text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data && data.length > 0 ? (
              data.map((feedback: Feedback) => (
                <TableRow
                  key={feedback.id}
                  className="bg-white hover:bg-gray-50 shadow-sm border border-gray-100 rounded-lg"
                >
                  <TableCell className="py-3 px-4 text-gray-800 font-medium">
                    {feedback.full_name}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-700">
                    {feedback.email}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-600 max-w-[250px] truncate">
                    {feedback.description.length > 50
                      ? feedback.description.slice(0, 50) + "..."
                      : feedback.description}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-600">
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-4 flex justify-center items-center gap-2">
                    {/* View Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:bg-blue-50 rounded-full"
                          onClick={() => setSelectedFeedback(feedback)}
                        >
                          <Icon icon="mdi:eye-outline" width={18} height={18} />
                        </Button>
                      </DialogTrigger>

                      {selectedFeedback &&
                        selectedFeedback.id === feedback.id && (
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-xl font-semibold mb-2">
                                Feedback Details
                              </DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Full feedback details from{" "}
                                <strong>{selectedFeedback.full_name}</strong>
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 space-y-3 text-gray-800">
                              <p>
                                <strong>Full Name:</strong>{" "}
                                {selectedFeedback.full_name}
                              </p>
                              <p>
                                <strong>Email:</strong> {selectedFeedback.email}
                              </p>
                              <p>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  selectedFeedback.created_at
                                ).toLocaleString()}
                              </p>
                              <p>
                                <strong>Description:</strong>
                              </p>
                              <p className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm leading-relaxed">
                                {selectedFeedback.description}
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
                      onClick={() => deleteMutation.mutate(feedback.id)}
                      disabled={deleteMutation.isPending}
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
                  colSpan={5}
                  className="text-center text-gray-500 py-6"
                >
                  No feedbacks found.
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
