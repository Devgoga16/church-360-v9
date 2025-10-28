import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowLeft, Inbox } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
            <Inbox className="h-10 w-10 text-slate-400" />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              404
            </h1>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Página no encontrada
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Esta página está bajo construcción o no existe. Puedes volver al
              inicio o explorar otras secciones.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </Layout>
  );
}
