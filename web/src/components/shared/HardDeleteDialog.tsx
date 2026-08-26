"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export interface HardDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
  itemType?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  warningMessage?: string;
}

export function HardDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  itemName,
  itemType = "item",
  confirmText = "Delete Permanently",
  cancelText = "Cancel",
  loading = false,
  warningMessage,
}: HardDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const isProcessing = isDeleting || loading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!isProcessing}>
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-red-600 dark:text-red-500">
                {title || `Permanently Delete ${itemType}?`}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {description ||
                  (itemName ? (
                    <>
                      Are you sure you want to permanently delete{" "}
                      <span className="font-medium text-foreground">
                        {itemName}
                      </span>
                      ? This action cannot be undone.
                    </>
                  ) : (
                    `This will permanently delete this ${itemType}. This action cannot be undone.`
                  ))}
              </DialogDescription>
              {warningMessage && (
                <div className="mt-3 rounded-lg bg-red-50 border border-red-200 p-3 dark:bg-red-900/20 dark:border-red-800">
                  <p className="text-xs text-red-800 dark:text-red-300">
                    <strong>Warning:</strong> {warningMessage}
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isProcessing ? "Deleting..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
