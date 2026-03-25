export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-cyan/20 border-t-cyan" />
        <p className="mt-4 text-slate-600">{text}</p>
      </div>
    </div>
  );
}
