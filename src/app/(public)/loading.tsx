export default function PublicLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-16">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-sky-200 border-t-sky-600 rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
