"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <p>Contact us at admin@ploshtadka.bg</p>
              <div className="text-center text-sm">
                Remember your password?{" "}
                <a
                  href="/auth/sign-in"
                  className="underline underline-offset-4"
                >
                  Back to sign in
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://ui.shadcn.com/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.95] dark:invert"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
