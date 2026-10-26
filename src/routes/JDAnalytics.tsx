import { createFileRoute } from "@tanstack/react-router";
import JDAnalytics from "@/components/JDAnalytics";

export const Route = createFileRoute("/JDAnalytics")({
  component: JDAnalyticsPage,
});

function JDAnalyticsPage() {
  return <JDAnalytics />;
}
