import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  searchParams?: {
    from?: string;
  };
};

export default async function UnauthorizedPage({ searchParams }: Props) {
  const previousPath = searchParams?.from || "/";

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center gap-6">
              <h1 className="text-2xl font-bold">Unauthorized</h1>
              <p className="text-balance text-muted-foreground">
                You are not authorized to access this page.
              </p>
              <Button asChild className="w-full">
                <Link href={previousPath}>Return to previous page</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
