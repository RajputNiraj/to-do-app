import { Suspense } from "react";
import { CheckInboxContent } from "./content";

export default function CheckInboxPage() {
  return (
    <Suspense>
      <CheckInboxContent />
    </Suspense>
  );
}
