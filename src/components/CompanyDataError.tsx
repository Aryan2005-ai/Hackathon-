import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function CompanyDataError() {
  const router = useRouter();
  return (
    <div role="alert" className="space-y-3 p-6">
      <h1 className="text-lg font-semibold">Company data could not be loaded</h1>
      <p className="text-sm text-muted-foreground">Please retry in a moment.</p>
      <div className="flex gap-2">
        <Button onClick={() => router.invalidate()}>Retry</Button>
        <Button variant="outline" asChild>
          <Link to="/">All Companies</Link>
        </Button>
      </div>
    </div>
  );
}

export function CompanyDataMissing() {
  return (
    <div className="space-y-3 p-6">
      <p>This company is no longer available.</p>
      <Button variant="outline" asChild>
        <Link to="/">All Companies</Link>
      </Button>
    </div>
  );
}
