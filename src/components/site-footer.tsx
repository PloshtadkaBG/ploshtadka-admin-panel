export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="px-4 py-6 lg:px-6">
        <div className="flex flex-col items-center justify-center space-y-1 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ploshtadka.BG
          </p>
          <p className="text-xs text-muted-foreground/40">
            built with ShadcnStore
          </p>
        </div>
      </div>
    </footer>
  );
}
