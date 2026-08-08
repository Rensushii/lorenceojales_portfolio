export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 mx-auto max-w-[1100px] border-t border-white/[0.04] px-4 py-7 text-center text-[0.75rem] text-text-muted">
      <p>
        &copy; {year} <span className="font-semibold text-text-primary">Lorence B. Ojales</span> — Computer
        Engineer. Built with precision.
      </p>
    </footer>
  );
}
