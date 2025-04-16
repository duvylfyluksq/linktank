"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ConfirmDialog({
  open,
  onConfirm,
  onCancel
}: {
  open: boolean;
  onConfirm: () => Promise<void>; 
  onCancel: () => void;
}) {

    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
          setLoading(true);
          await onConfirm();
        } catch (error) {
          console.error("Error during confirmation:", error);
        } finally {
          setLoading(false);
        }
      };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to cancel your subscription? This action cannot be undone.
        </p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            No, go back
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? "Cancelling..." : "Yes, cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
