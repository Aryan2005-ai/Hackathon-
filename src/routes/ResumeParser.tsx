import { createFileRoute } from "@tanstack/react-router";
import ResumeParser from "@/components/ResumeParser";

export const Route = createFileRoute("/ResumeParser")({
  component: ResumeParserPage,
});

function ResumeParserPage() {
  return <ResumeParser />;
}
