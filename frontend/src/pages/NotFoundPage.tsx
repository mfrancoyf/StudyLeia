import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-gradient-to-b from-brand-50 to-white">
      <h1 className="text-4xl font-bold text-brand-700">404</h1>
      <p className="text-slate-500">Essa página se perdeu procurando a Leia.</p>
      <Link to="/" className="text-brand-600 underline">Voltar para o início</Link>
    </div>
  );
}
