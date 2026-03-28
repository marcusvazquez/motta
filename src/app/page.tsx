"use client";

import { useState } from "react";

export interface Product {
  id: string;
  name: string;
  details: string;
  value: number;
}

const INITIAL_FORM = {
  name: "",
  details: "",
  value: "",
};

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const handleAddProduct = () => {
    const name = form.name.trim();
    const details = form.details.trim();
    const valueRaw = form.value.trim();

    if (!name || !details || !valueRaw) {
      setFormError("Completa todos los campos antes de agregar el producto.");
      return;
    }

    const parsed = Number(valueRaw.replace(",", "."));
    if (Number.isNaN(parsed)) {
      setFormError("El valor debe ser un número válido.");
      return;
    }

    setFormError(null);
    setProducts((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name,
        details,
        value: parsed,
      },
    ]);
    setForm(INITIAL_FORM);
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center px-4 py-5 sm:px-6">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 sm:text-2xl">
            MiAppCatálogo
          </h1>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:gap-8">
        <section className="flex w-full flex-col lg:max-w-md lg:flex-shrink-0 xl:max-w-lg">
          <div className="rounded-xl border border-zinc-100 bg-white p-6 shadow-md shadow-zinc-200/50">
            <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">Registrar Producto</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Ingresa los detalles para añadir un nuevo artículo al catálogo.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="product-name" className="block text-sm font-medium text-zinc-800">
                  Nombre del producto
                </label>
                <input
                  id="product-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setFormError(null);
                    setForm((f) => ({ ...f, name: e.target.value }));
                  }}
                  placeholder="Ej. Computadora portátil"
                  className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 placeholder:text-zinc-400 outline-none ring-zinc-900/5 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label htmlFor="product-details" className="block text-sm font-medium text-zinc-800">
                  Detalle
                </label>
                <textarea
                  id="product-details"
                  value={form.details}
                  onChange={(e) => {
                    setFormError(null);
                    setForm((f) => ({ ...f, details: e.target.value }));
                  }}
                  placeholder="Describe las características principales..."
                  rows={4}
                  className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 placeholder:text-zinc-400 outline-none ring-zinc-900/5 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label htmlFor="product-value" className="block text-sm font-medium text-zinc-800">
                  Valor
                </label>
                <div className="mt-1.5 flex overflow-hidden rounded-lg border border-zinc-200 bg-white ring-zinc-900/5 transition focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20">
                  <span
                    className="flex items-center border-r border-zinc-200 bg-zinc-50 px-3 text-sm font-semibold text-zinc-700"
                    aria-hidden
                  >
                    $
                  </span>
                  <input
                    id="product-value"
                    type="text"
                    inputMode="decimal"
                    value={form.value}
                    onChange={(e) => {
                      setFormError(null);
                      setForm((f) => ({ ...f, value: e.target.value }));
                    }}
                    placeholder="0.00"
                    className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-zinc-900 placeholder:text-zinc-400 outline-none"
                  />
                </div>
              </div>

              {formError ? (
                <p className="text-sm text-red-600" role="alert">
                  {formError}
                </p>
              ) : null}

              <button
                type="button"
                onClick={handleAddProduct}
                className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                + Agregar Producto
              </button>
            </div>
          </div>
        </section>

        <section className="flex min-h-[320px] flex-1 flex-col">
          <div className="flex h-full min-h-0 flex-1 flex-col rounded-xl border border-zinc-100 bg-white p-6 shadow-md shadow-zinc-200/50">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">Vitrina de Productos</h2>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-200/80">
                [{products.length}] Artículos registrados
              </span>
            </div>

            {products.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12 text-center">
                <BoxIcon className="text-zinc-300" />
                <h3 className="text-base font-semibold text-zinc-800 sm:text-lg">
                  Tu catálogo está vacío
                </h3>
                <p className="max-w-sm text-sm text-zinc-500">
                  Registra tu primer producto en el panel izquierdo para verlo aparecer aquí
                  instantáneamente.
                </p>
              </div>
            ) : (
              <ul className="mt-6 flex max-h-[min(60vh,520px)] flex-col gap-3 overflow-y-auto pr-1">
                {products.map((product) => (
                  <li
                    key={product.id}
                    className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-4 shadow-sm ring-1 ring-zinc-100"
                  >
                    <p className="font-semibold text-zinc-900">{product.name}</p>
                    <p className="mt-1 text-sm text-zinc-600">{product.details}</p>
                    <p className="mt-2 text-sm font-bold text-emerald-700">
                      ${product.value.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t border-zinc-800 bg-zinc-900 py-5">
        <p className="px-4 text-center text-sm text-white">
          Desarrollado por [INSERTA AQUÍ TU NOMBRE COMPLETO] - Grupo: [INSERTA AQUÍ TU GRUPO]
        </p>
      </footer>
    </div>
  );
}
