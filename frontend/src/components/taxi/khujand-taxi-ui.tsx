"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Clock3,
  Wallet,
  RotateCcw,
  MapPinned,
  Route,
  Timer,
} from "lucide-react";
import TaxiMap, { MapPoint } from "./taxi-map";
import { getRoute } from "@/lib/route";

const tariffs = [
  {
    id: "economy",
    name: "Эконом",
    subtitle: "Быстро и доступно",
    perKm: 1.5,
    delayRate: 0.2,
    minFare: 8,
    eta: "3-5 мин",
  },
  {
    id: "comfort",
    name: "Комфорт",
    subtitle: "Более удобная поездка",
    perKm: 2,
    delayRate: 0.25,
    minFare: 10,
    eta: "4-6 мин",
  },
  {
    id: "business",
    name: "Бизнес",
    subtitle: "Премиальный сервис",
    perKm: 3,
    delayRate: 0.35,
    minFare: 14,
    eta: "5-8 мин",
  },
] as const;

type TariffId = (typeof tariffs)[number]["id"];

function roundFare(value: number) {
  return Math.round(value);
}

function calculateFare(
  distanceKm: number,
  delayMinutes: number,
  tariffId: TariffId
) {
  const tariff = tariffs.find((t) => t.id === tariffId)!;
  const raw = distanceKm * tariff.perKm + delayMinutes * tariff.delayRate;
  return Math.max(tariff.minFare, roundFare(raw));
}

export default function KhujandTaxiUI() {
  const [pickupPoint, setPickupPoint] = useState<MapPoint | null>(null);
  const [dropoffPoint, setDropoffPoint] = useState<MapPoint | null>(null);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [durationMin, setDurationMin] = useState(0);
  const [tariff, setTariff] = useState<TariffId>("economy");
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [routeError, setRouteError] = useState("");

  const delayMinutes = useMemo(() => {
    if (durationMin <= 10) return 0;
    if (durationMin <= 20) return 2;
    if (durationMin <= 30) return 4;
    return 6;
  }, [durationMin]);

  const fare = useMemo(
    () => calculateFare(distanceKm, delayMinutes, tariff),
    [distanceKm, delayMinutes, tariff]
  );

  useEffect(() => {
    async function loadRoute() {
      if (!pickupPoint || !dropoffPoint) {
        setRoutePoints([]);
        setDistanceKm(0);
        setDurationMin(0);
        return;
      }

      try {
        setLoadingRoute(true);
        setRouteError("");

        const result = await getRoute(pickupPoint, dropoffPoint);

        setDistanceKm(result.distanceKm);
        setDurationMin(result.durationMin);
        setRoutePoints(result.geometry);
      } catch {
        setRouteError("Не удалось построить маршрут");
        setRoutePoints([]);
        setDistanceKm(0);
        setDurationMin(0);
      } finally {
        setLoadingRoute(false);
      }
    }

    loadRoute();
  }, [pickupPoint, dropoffPoint]);

  function handleSelectPoints(
    pickup: MapPoint | null,
    dropoff: MapPoint | null
  ) {
    setPickupPoint(pickup);
    setDropoffPoint(dropoff);
  }

  function resetRoute() {
    setPickupPoint(null);
    setDropoffPoint(null);
    setRoutePoints([]);
    setDistanceKm(0);
    setDurationMin(0);
    setRouteError("");
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-7xl p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 lg:grid-cols-[420px_1fr]"
        >
          {/* Left panel */}
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-xl bg-[var(--primary)] p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    Закажите поездку
                  </h1>
                  <p className="mt-1 text-[13px] text-white/60">
                    Выберите маршрут на карте
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <Car className="h-7 w-7" />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2.5 text-[13px] text-white/70">
                <MapPinned className="h-4 w-4 shrink-0" />
                Нажмите на карту, чтобы выбрать точки маршрута
              </div>
            </div>

            {/* Tariffs */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
              <div className="space-y-2">
                {tariffs.map((item) => {
                  const active = item.id === tariff;
                  const itemFare = calculateFare(
                    distanceKm,
                    delayMinutes,
                    item.id
                  );

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTariff(item.id)}
                      className={`w-full rounded-lg border p-3.5 text-left transition-all ${
                        active
                          ? "border-[var(--accent)] bg-[var(--accent)]/5 ring-1 ring-[var(--accent)]"
                          : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--muted-foreground)]/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-[var(--foreground)]">
                              {item.name}
                            </span>
                            {active && (
                              <span className="rounded-md bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-medium text-white">
                                Выбран
                              </span>
                            )}
                          </div>
                          <div className="mt-0.5 text-[12px] text-[var(--muted-foreground)]">
                            {item.subtitle}
                          </div>
                          <div className="mt-2 inline-flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
                            <Clock3 className="h-3 w-3" />
                            {item.eta}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-[var(--foreground)]">
                            {itemFare}
                          </div>
                          <div className="text-[11px] text-[var(--muted-foreground)]">
                            TJS
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex h-10 flex-1 items-center justify-center rounded-lg bg-[var(--accent)] text-[13px] font-semibold text-white transition-colors hover:bg-[var(--accent)]/90">
                  Заказать такси
                </button>
                <button
                  type="button"
                  onClick={resetRoute}
                  className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 text-[13px] font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--muted)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Сбросить
                </button>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Map */}
            <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)]">
              <div className="relative h-[520px] w-full">
                <TaxiMap
                  pickup={pickupPoint}
                  dropoff={dropoffPoint}
                  routePoints={routePoints}
                  onSelectPoints={handleSelectPoints}
                />

                <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-2 text-[12px] text-[var(--muted-foreground)] shadow-sm">
                  Выберите точку отправления и назначения
                </div>

                {loadingRoute && (
                  <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-[var(--primary)] px-3 py-2 text-[12px] text-white shadow-sm">
                    Маршрут рассчитывается...
                  </div>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="flex items-center gap-2 text-[12px] text-[var(--muted-foreground)]">
                  <Route className="h-4 w-4 text-[var(--accent)]" />
                  Расстояние
                </div>
                <div className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                  {distanceKm} <span className="text-sm font-normal text-[var(--muted-foreground)]">км</span>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="flex items-center gap-2 text-[12px] text-[var(--muted-foreground)]">
                  <Timer className="h-4 w-4 text-[var(--accent)]" />
                  Время поездки
                </div>
                <div className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                  {durationMin} <span className="text-sm font-normal text-[var(--muted-foreground)]">мин</span>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
                <div className="flex items-center gap-2 text-[12px] text-[var(--muted-foreground)]">
                  <Wallet className="h-4 w-4 text-[var(--accent)]" />
                  Стоимость
                </div>
                <div className="mt-2 text-2xl font-bold text-[var(--foreground)]">
                  {fare} <span className="text-sm font-normal text-[var(--muted-foreground)]">TJS</span>
                </div>
              </div>
            </div>

            {routeError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-[13px] text-[var(--destructive)]">
                {routeError}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
