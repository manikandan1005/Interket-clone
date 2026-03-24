// app/inbox/layout.tsx

import InboxPageClient from "./InboxPageClient";

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InboxPageClient>{children}</InboxPageClient>;
}