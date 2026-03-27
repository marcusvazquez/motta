"use client";

import { useEffect, useMemo, useState } from "react";

type VistaActiva = "tienda" | "almacen";

interface Producto {
  codigo: string;
  nombre: string;
  descripcion: string;
  unidad: string;
  stock_minimo: number;
  stock_actual: number;
  precio: number;
}

interface Movimiento {
  id: string;
  codigo: string;
  nombre: string;
  tipo: "Entrada" | "Salida";
  cantidad: number;
  motivo: string;
  fecha: string;
}

type Carrito = Record<string, number>;

const INVENTARIO_KEY = "abarrotes_inventario";
const CARRITO_KEY = "abarrotes_carrito";
const MOVIMIENTOS_KEY = "abarrotes_movimientos";
const VISTA_KEY = "abarrotes_vista";

const INVENTARIO_INICIAL: Producto[] = [
  { codigo: "A001", nombre: "Arroz", descripcion: "Bolsa de 1 kg", unidad: "pieza", stock_minimo: 5, stock_actual: 20, precio: 25 },
  { codigo: "A002", nombre: "Frijol Pinto", descripcion: "Bolsa de 1 kg", unidad: "pieza", stock_minimo: 5, stock_actual: 15, precio: 30 },
  { codigo: "A003", nombre: "Azucar", descripcion: "Bolsa de 1 kg", unidad: "pieza", stock_minimo: 5, stock_actual: 25, precio: 28 },
  { codigo: "A004", nombre: "Aceite Vegetal", descripcion: "Botella 1 Litro", unidad: "pieza", stock_minimo: 4, stock_actual: 12, precio: 45 },
  { codigo: "A005", nombre: "Leche Entera", descripcion: "Caja 1 Litro", unidad: "pieza", stock_minimo: 6, stock_actual: 30, precio: 22 },
  { codigo: "A006", nombre: "Huevos", descripcion: "Cartera con 30 piezas", unidad: "pieza", stock_minimo: 3, stock_actual: 10, precio: 80 },
  { codigo: "A007", nombre: "Pan de Caja", descripcion: "Blanco grande", unidad: "pieza", stock_minimo: 4, stock_actual: 15, precio: 40 },
  { codigo: "A008", nombre: "Atun en Agua", descripcion: "Lata 140g", unidad: "pieza", stock_minimo: 10, stock_actual: 40, precio: 20 },
  { codigo: "A009", nombre: "Mayonesa", descripcion: "Frasco 400g", unidad: "pieza", stock_minimo: 4, stock_actual: 12, precio: 45 },
  { codigo: "A010", nombre: "Pure de Tomate", descripcion: "Tetrapak 210g", unidad: "pieza", stock_minimo: 8, stock_actual: 35, precio: 8 },
  { codigo: "A011", nombre: "Sopa de Pasta", descripcion: "Fideo 200g", unidad: "pieza", stock_minimo: 10, stock_actual: 50, precio: 6 },
  { codigo: "A012", nombre: "Galletas", descripcion: "Paquete tipo Maria", unidad: "pieza", stock_minimo: 5, stock_actual: 20, precio: 18 },
  { codigo: "A013", nombre: "Cafe Soluble", descripcion: "Frasco 200g", unidad: "pieza", stock_minimo: 3, stock_actual: 8, precio: 85 },
  { codigo: "A014", nombre: "Cereal", descripcion: "Hojuelas de maiz 500g", unidad: "pieza", stock_minimo: 4, stock_actual: 12, precio: 65 },
  { codigo: "A015", nombre: "Papel Higienico", descripcion: "Paquete 4 rollos", unidad: "paquete", stock_minimo: 5, stock_actual: 18, precio: 35 },
  { codigo: "A016", nombre: "Jabon en Polvo", descripcion: "Bolsa 1kg", unidad: "pieza", stock_minimo: 4, stock_actual: 14, precio: 38 },
  { codigo: "A017", nombre: "Jabon de Barra", descripcion: "Para lavanderia", unidad: "pieza", stock_minimo: 5, stock_actual: 25, precio: 15 },
  { codigo: "A018", nombre: "Refresco Cola", descripcion: "Botella 2 Litros", unidad: "pieza", stock_minimo: 6, stock_actual: 24, precio: 35 },
  { codigo: "A019", nombre: "Agua Purificada", descripcion: "Garrafon 20L", unidad: "pieza", stock_minimo: 5, stock_actual: 15, precio: 40 },
  { codigo: "A020", nombre: "Sal de Mesa", descripcion: "Bolsa 1kg", unidad: "pieza", stock_minimo: 5, stock_actual: 20, precio: 12 },
];

export default function Home() {
  const [inventario, setInventario] = useState<Producto[]>(INVENTARIO_INICIAL);
  const [carrito, setCarrito] = useState<Carrito>({});
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [vistaActiva, setVistaActiva] = useState<VistaActiva>("tienda");
  const [entradaPorProducto, setEntradaPorProducto] = useState<Record<string, string>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const inventarioGuardado = localStorage.getItem(INVENTARIO_KEY);
    const carritoGuardado = localStorage.getItem(CARRITO_KEY);
    const movimientosGuardados = localStorage.getItem(MOVIMIENTOS_KEY);
    const vistaGuardada = localStorage.getItem(VISTA_KEY);

    if (inventarioGuardado) {
      setInventario(JSON.parse(inventarioGuardado) as Producto[]);
    }
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado) as Carrito);
    }
    if (movimientosGuardados) {
      setMovimientos(JSON.parse(movimientosGuardados) as Movimiento[]);
    }
    if (vistaGuardada === "tienda" || vistaGuardada === "almacen") {
      setVistaActiva(vistaGuardada);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(INVENTARIO_KEY, JSON.stringify(inventario));
  }, [inventario, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  }, [carrito, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(MOVIMIENTOS_KEY, JSON.stringify(movimientos));
  }, [movimientos, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(VISTA_KEY, vistaActiva);
  }, [vistaActiva, isHydrated]);

  const totalPiezasCarrito = useMemo(
    () => Object.values(carrito).reduce((acc, qty) => acc + qty, 0),
    [carrito],
  );

  const totalCarrito = useMemo(
    () =>
      inventario.reduce((acc, producto) => {
        const qty = carrito[producto.codigo] ?? 0;
        return acc + qty * producto.precio;
      }, 0),
    [inventario, carrito],
  );

  const agregarAlCarrito = (codigo: string) => {
    const producto = inventario.find((item) => item.codigo === codigo);
    if (!producto) return;

    const cantidadEnCarrito = carrito[codigo] ?? 0;
    const disponible = producto.stock_actual - cantidadEnCarrito;
    if (disponible <= 0) return;

    setCarrito((prev) => ({
      ...prev,
      [codigo]: cantidadEnCarrito + 1,
    }));
  };

  const quitarDelCarrito = (codigo: string) => {
    setCarrito((prev) => {
      const actual = prev[codigo] ?? 0;
      if (actual <= 1) {
        const { [codigo]: eliminado, ...resto } = prev;
        void eliminado;
        return resto;
      }
      return { ...prev, [codigo]: actual - 1 };
    });
  };

  const finalizarCompra = () => {
    const codigosConCompra = Object.keys(carrito).filter((codigo) => (carrito[codigo] ?? 0) > 0);
    if (codigosConCompra.length === 0) return;

    const fecha = new Date().toISOString();
    const nuevosMovimientos: Movimiento[] = [];

    const inventarioActualizado = inventario.map((producto) => {
      const cantidad = carrito[producto.codigo] ?? 0;
      if (cantidad <= 0) return producto;

      nuevosMovimientos.push({
        id: crypto.randomUUID(),
        codigo: producto.codigo,
        nombre: producto.nombre,
        tipo: "Salida",
        cantidad,
        motivo: "Venta",
        fecha,
      });

      return {
        ...producto,
        stock_actual: Math.max(producto.stock_actual - cantidad, 0),
      };
    });

    setInventario(inventarioActualizado);
    setMovimientos((prev) => [ ...nuevosMovimientos, ...prev ]);
    setCarrito({});
  };

  const registrarEntrada = (codigo: string) => {
    const entradaTexto = entradaPorProducto[codigo] ?? "";
    const cantidad = Number(entradaTexto);
    if (!Number.isInteger(cantidad) || cantidad <= 0) return;

    const fecha = new Date().toISOString();
    const producto = inventario.find((item) => item.codigo === codigo);
    if (!producto) return;

    setInventario((prev) =>
      prev.map((item) =>
        item.codigo === codigo
          ? { ...item, stock_actual: item.stock_actual + cantidad }
          : item,
      ),
    );

    setMovimientos((prev) => [
      {
        id: crypto.randomUUID(),
        codigo: producto.codigo,
        nombre: producto.nombre,
        tipo: "Entrada",
        cantidad,
        motivo: "Surtido",
        fecha,
      },
      ...prev,
    ]);

    setEntradaPorProducto((prev) => ({ ...prev, [codigo]: "" }));
  };

  return (
    <div className="min-h-screen bg-sky-100 text-slate-900">
      <header className="border-b border-sky-300 bg-sky-500 px-6 py-4 text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Sistema de Control de Entradas y Salidas de Almacen
          </h1>
          <div className="rounded-full bg-sky-200/30 px-4 py-1 text-sm font-semibold">
            Carrito: {totalPiezasCarrito} productos
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-6 flex gap-3">
          <button
            type="button"
            onClick={() => setVistaActiva("tienda")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              vistaActiva === "tienda"
                ? "bg-sky-500 text-white"
                : "bg-white text-sky-700 ring-1 ring-sky-300"
            }`}
          >
            Vista de Tienda (Salidas)
          </button>
          <button
            type="button"
            onClick={() => setVistaActiva("almacen")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              vistaActiva === "almacen"
                ? "bg-sky-500 text-white"
                : "bg-white text-sky-700 ring-1 ring-sky-300"
            }`}
          >
            Panel de Almacen (Admin)
          </button>
        </div>

        {vistaActiva === "tienda" ? (
          <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-200">
              <h2 className="text-xl font-bold text-sky-700">Productos de Abarrotes</h2>
              <p className="mt-1 text-sm text-slate-600">
                Agrega productos al carrito. El stock disponible baja en tiempo real.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {inventario.map((producto) => {
                  const enCarrito = carrito[producto.codigo] ?? 0;
                  const disponible = producto.stock_actual - enCarrito;
                  const enMinimo = disponible <= producto.stock_minimo;

                  return (
                    <article
                      key={producto.codigo}
                      className="rounded-xl bg-sky-50 p-4 ring-1 ring-sky-200"
                    >
                      <h3 className="text-lg font-semibold text-slate-900">{producto.nombre}</h3>
                      <p className="mt-1 text-sm text-slate-600">{producto.descripcion}</p>
                      <p className="mt-2 text-sm font-bold text-sky-700">${producto.precio.toFixed(2)}</p>
                      <p
                        className={`mt-1 text-sm font-medium ${
                          enMinimo ? "text-rose-700" : "text-slate-600"
                        }`}
                      >
                        Quedan {disponible} productos disponibles
                      </p>
                      <button
                        type="button"
                        onClick={() => agregarAlCarrito(producto.codigo)}
                        disabled={disponible <= 0}
                        className="mt-4 w-full rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-sky-300"
                      >
                        Agregar al carrito
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

            <aside className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-200">
              <h2 className="text-xl font-bold text-sky-700">Carrito</h2>
              {totalPiezasCarrito === 0 ? (
                <p className="mt-3 text-sm text-slate-600">No hay productos en el carrito.</p>
              ) : (
                <>
                  <ul className="mt-4 space-y-3">
                    {inventario
                      .filter((producto) => (carrito[producto.codigo] ?? 0) > 0)
                      .map((producto) => {
                        const cantidad = carrito[producto.codigo] ?? 0;
                        return (
                          <li
                            key={producto.codigo}
                            className="rounded-lg bg-sky-50 p-3 ring-1 ring-sky-200"
                          >
                            <p className="text-sm font-semibold text-slate-900">{producto.nombre}</p>
                            <p className="text-xs text-slate-600">
                              {cantidad} x ${producto.precio.toFixed(2)}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <p className="text-sm font-bold text-sky-700">
                                ${(cantidad * producto.precio).toFixed(2)}
                              </p>
                              <button
                                type="button"
                                onClick={() => quitarDelCarrito(producto.codigo)}
                                className="rounded-md bg-sky-200 px-2 py-1 text-xs font-semibold text-sky-900 hover:bg-sky-300"
                              >
                                Quitar uno
                              </button>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  <div className="mt-4 border-t border-sky-200 pt-4">
                    <p className="text-sm text-slate-700">
                      Total: <span className="font-bold text-sky-700">${totalCarrito.toFixed(2)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={finalizarCompra}
                      className="mt-3 w-full rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-white hover:bg-sky-600"
                    >
                      Finalizar compra
                    </button>
                  </div>
                </>
              )}
            </aside>
          </section>
        ) : (
          <section className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-200">
              <h2 className="text-xl font-bold text-sky-700">Inventario Actual</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-sky-100 text-slate-700">
                    <tr>
                      <th className="px-3 py-2">Codigo</th>
                      <th className="px-3 py-2">Producto</th>
                      <th className="px-3 py-2">Stock actual</th>
                      <th className="px-3 py-2">Stock minimo</th>
                      <th className="px-3 py-2">Entrada</th>
                      <th className="px-3 py-2">Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventario.map((producto) => {
                      const alerta = producto.stock_actual <= producto.stock_minimo;
                      return (
                        <tr key={producto.codigo} className="border-b border-sky-100">
                          <td className="px-3 py-2 font-mono">{producto.codigo}</td>
                          <td className="px-3 py-2">
                            <p className="font-semibold">{producto.nombre}</p>
                            <p className="text-xs text-slate-600">{producto.unidad}</p>
                          </td>
                          <td className={`px-3 py-2 font-semibold ${alerta ? "text-rose-700" : "text-slate-900"}`}>
                            {producto.stock_actual}
                          </td>
                          <td className="px-3 py-2">{producto.stock_minimo}</td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              min={1}
                              value={entradaPorProducto[producto.codigo] ?? ""}
                              onChange={(event) =>
                                setEntradaPorProducto((prev) => ({
                                  ...prev,
                                  [producto.codigo]: event.target.value,
                                }))
                              }
                              className="w-24 rounded-md border border-sky-300 px-2 py-1 outline-none focus:ring-2 focus:ring-sky-300"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <button
                              type="button"
                              onClick={() => registrarEntrada(producto.codigo)}
                              className="rounded-md bg-sky-500 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-600"
                            >
                              Registrar entrada
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sky-200">
              <h2 className="text-xl font-bold text-sky-700">Historial de Movimientos</h2>
              {movimientos.length === 0 ? (
                <p className="mt-3 text-sm text-slate-600">No hay movimientos registrados.</p>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="bg-sky-100 text-slate-700">
                      <tr>
                        <th className="px-3 py-2">Fecha</th>
                        <th className="px-3 py-2">Tipo</th>
                        <th className="px-3 py-2">Codigo</th>
                        <th className="px-3 py-2">Producto</th>
                        <th className="px-3 py-2">Cantidad</th>
                        <th className="px-3 py-2">Motivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movimientos.map((movimiento) => (
                        <tr key={movimiento.id} className="border-b border-sky-100">
                          <td className="px-3 py-2">{new Date(movimiento.fecha).toLocaleString("es-MX")}</td>
                          <td
                            className={`px-3 py-2 font-semibold ${
                              movimiento.tipo === "Entrada" ? "text-emerald-700" : "text-rose-700"
                            }`}
                          >
                            {movimiento.tipo}
                          </td>
                          <td className="px-3 py-2 font-mono">{movimiento.codigo}</td>
                          <td className="px-3 py-2">{movimiento.nombre}</td>
                          <td className="px-3 py-2">{movimiento.cantidad}</td>
                          <td className="px-3 py-2">{movimiento.motivo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
