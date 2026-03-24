import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function InboxPage() {
  const cookieStore = await cookies();
  const key = process.env.AUTH_COOKIE_KEY || "AUTH_TOKEN";
  const auth = cookieStore.get(key)?.value;

  if (!auth) {
    redirect("/login");
  }

  return redirect("/inbox/chat");
}
