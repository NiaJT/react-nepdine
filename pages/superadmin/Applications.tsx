"use client";

import { useState } from "react";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react/dist/iconify.js";
import toast from "react-hot-toast";
import Image from "@/components/ui/image";

import {
  IApplication,
  useGetApplications,
  useVerifyApplication,
} from "@/hooks/superAdmin/useVerify";

export default function ApplicationsPage() {
  const [page, setPage] = useState(1);
  const { data: applications = [], isLoading } = useGetApplications();
  const verifyMutation = useVerifyApplication();
  const [selectedApp, setSelectedApp] = useState<IApplication | null>(null);

  const handleVerify = async (id: string) => {
    try {
      await verifyMutation.mutateAsync(id);
      setSelectedApp(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify application");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <h1 className="text-2xl font-bold mb-4">Applications</h1>
      <div className="overflow-x-auto">
        <Table className="min-w-full bg-white rounded-2xl shadow-md border border-gray-100 border-separate border-spacing-y-2 p-2">
          <TableHeader>
            <TableRow className="bg-gray-50 text-gray-700">
              <TableHead className="font-semibold text-sm py-3">
                Restaurant
              </TableHead>
              <TableHead className="font-semibold text-sm py-3">
                Status
              </TableHead>
              <TableHead className="font-semibold text-sm py-3">
                Submitted At
              </TableHead>
              <TableHead className="font-semibold text-sm py-3 text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {applications.length > 0 ? (
              applications.map((app: IApplication) => (
                <TableRow
                  key={app.id}
                  className="bg-white hover:bg-gray-50 shadow-sm border border-gray-100 rounded-lg"
                >
                  <TableCell className="py-3 px-4 text-gray-800 font-medium capitalize">
                    <div className="flex items-center gap-2">
                      <Image
                        width={50}
                        height={50}
                        src={app.restaurant_image_url}
                        alt={app.restaurant_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span>{app.restaurant_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-600 capitalize">
                    {app.status}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-600">
                    {new Date(app.submitted_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3 px-4 flex justify-center items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:bg-green-50 rounded-full"
                          onClick={() => setSelectedApp(app)}
                          disabled={app.status === "verified"}
                        >
                          <Icon icon="mdi:check-bold" width={18} height={18} />
                        </Button>
                      </DialogTrigger>

                      {selectedApp && selectedApp.id === app.id && (
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">
                              Verify Application
                            </DialogTitle>
                            <DialogDescription>
                              Are you sure you want to verify the application
                              for <strong>{selectedApp.restaurant_name}</strong>
                              ?
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setSelectedApp(null)}
                            >
                              Cancel
                            </Button>
                            <Button
                              className="bg-green-600 text-white hover:bg-green-700"
                              onClick={() => handleVerify(selectedApp.id)}
                              disabled={verifyMutation.isPending}
                            >
                              {verifyMutation.isPending
                                ? "Verifying..."
                                : "Verify"}
                            </Button>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-500 py-6"
                >
                  No applications found.
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
          disabled={page === 1 || isLoading}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span className="text-gray-600 text-sm">Page {page}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={applications.length < 10}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
