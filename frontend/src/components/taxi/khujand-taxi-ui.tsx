"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Clock3,
  Wallet,
  RotateCcw,
  MapPinned,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

  const selectedTariff = tariffs.find((t) => t.id === tariff)!;

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
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl p-4 lg:p-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 lg:grid-cols-[420px_1fr]"
        >
          <div className="space-y-5">
            <div className="rounded-[28px] bg-slate-900 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-300">
                    Khujand Taxi
                  </div>
                  <h1 className="mt-2 text-3xl font-bold">
                    Закажите поездку
                  </h1>
                  <p className="mt-2 text-sm text-slate-300">
                    Выберите маршрут на карте
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <Car className="h-8 w-8" />
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white/10 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <MapPinned className="h-4 w-4" />
                  Нажмите на карту, чтобы выбрать точки маршрута
                </div>
              </div>
            </div>

            <Card className="rounded-[28px] border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="space-y-3">
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
                        className={`w-full rounded-[24px] border p-4 text-left transition-all ${
                          active
                            ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-base font-semibold">
                                {item.name}
                              </span>
                              {active && (
                                <Badge className="rounded-full bg-white text-slate-900 hover:bg-white">
                                  Выбран
                                </Badge>
                              )}
                            </div>

                            <div
                              className={`mt-1 text-sm ${
                                active ? "text-slate-300" : "text-slate-500"
                              }`}
                            >
                              {item.subtitle}
                            </div>

                            <div
                              className={`mt-3 inline-flex items-center gap-1 text-xs ${
                                active ? "text-slate-300" : "text-slate-500"
                              }`}
                            >
                              <Clock3 className="h-3.5 w-3.5" />
                              {item.eta}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-bold">
                              {itemFare} TJS
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex gap-3">
                  <Button className="h-12 flex-1 rounded-2xl text-base font-semibold">
                    Заказать такси
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-2xl"
                    onClick={resetRoute}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Сбросить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className="overflow-hidden rounded-[28px] border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="relative h-[520px] w-full">
                  <TaxiMap
                    pickup={pickupPoint}
                    dropoff={dropoffPoint}
                    routePoints={routePoints}
                    onSelectPoints={handleSelectPoints}
                  />

                  <div className="pointer-events-none absolute left-4 top-4 rounded-2xl bg-white/95 px-4 py-3 text-sm shadow-lg">
                    Выберите точку отправления и точку назначения
                  </div>

                  {loadingRoute && (
                    <div className="pointer-events-none absolute bottom-4 left-4 rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
                      Маршрут рассчитывается...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-5 md:grid-cols-3">
              <Card className="rounded-[24px] border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="text-sm text-slate-500">Расстояние</div>
                  <div className="mt-2 text-3xl font-bold">{distanceKm} км</div>
                </CardContent>
              </Card>

              <Card className="rounded-[24px] border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="text-sm text-slate-500">Время поездки</div>
                  <div className="mt-2 text-3xl font-bold">{durationMin} мин</div>
                </CardContent>
              </Card>

              <Card className="rounded-[24px] border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Wallet className="h-4 w-4" />
                    Стоимость
                  </div>
                  <div className="mt-2 text-3xl font-bold">{fare} TJS</div>
                </CardContent>
              </Card>
            </div>

            {routeError && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 shadow-sm">
                {routeError}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}