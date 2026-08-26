import PageHeader from "../../_components/dashboard/page-header";
import LeadershipMessageManager from "./_components/leadership-message-manager";

export const metadata = {
  title: "Leadership Messages Management",
  description:
    "Create, edit, and manage leadership messages from Chairman, Principal, and Director for Pokhara College of Management website.",
  robots: { index: false, follow: false },
};

export default async function LeadershipMessagePage() {
  return (
    <>
      <PageHeader title="Leadership Messages" subtitle="People · Messages" />
      <LeadershipMessageManager />
    </>
  );
}
