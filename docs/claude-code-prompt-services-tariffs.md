# Промпт для Claude Code — Фича «Сервисы + Тарифы + Надбавки»

Скопируй этот промпт в Claude Code и запусти.

---

## ПРОМПТ:

```
Реализуй фичу «Сервисы такси + Тарифы + Надбавки» — полный цикл: backend → admin panel → mobile (passenger app).

Перед началом прочитай скилл taxi-app (SKILL.md и references/backend.md, references/admin.md, references/mobile.md).

---

## 1. BACKEND (Django + DRF)

### 1.1 Модели — файл: backend/apps/pricing/models/

Создай 3 модели (каждая в своём файле, наследуется от core.models.BaseModel):

**Service** (service.py) — класс такси:
- name: CharField(100) — «Эконом», «Комфорт», «Бизнес»
- description: TextField(blank=True) — описание сервиса
- icon: ImageField(upload_to="services/icons/", blank=True, null=True) — иконка
- sort_order: IntegerField(default=0) — порядок сортировки
- is_active: BooleanField(default=True)
- Meta: ordering = ["sort_order"]
- def __str__: return self.name

**Tariff** (tariff.py) — тариф, привязанный к сервису (OneToOne):
- service: OneToOneField(Service, on_delete=CASCADE, related_name="tariff")
- base_price: DecimalField(max_digits=10, decimal_places=2) — базовая цена посадки (сомони)
- price_per_km: DecimalField(max_digits=10, decimal_places=2) — цена за километр
- price_per_min: DecimalField(max_digits=10, decimal_places=2) — цена за минуту ожидания
- min_price: DecimalField(max_digits=10, decimal_places=2) — минимальная стоимость поездки
- is_active: BooleanField(default=True)
- def __str__: return f"Тариф: {self.service.name}"
- def calculate_price(self, distance_km, duration_min): вернуть max(base_price + price_per_km * distance_km + price_per_min * duration_min, min_price)

**Surcharge** (surcharge.py) — надбавки (ManyToMany к Service):
- name: CharField(100) — «Ночной тариф», «Праздничный», «Кондиционер», «Детское кресло»
- type: CharField(20, choices=TYPE_CHOICES) — "fixed" или "percent"
- value: DecimalField(max_digits=10, decimal_places=2) — сумма в сомони (если fixed) или процент (если percent)
- services: ManyToManyField(Service, related_name="surcharges", blank=True) — к каким сервисам применяется
- is_active: BooleanField(default=True)
- sort_order: IntegerField(default=0)
- def __str__: return self.name
- def apply(self, price): если type=="fixed" → price + value, если "percent" → price * (1 + value/100)

В models/__init__.py реэкспортируй все три модели.

### 1.2 Сервис (бизнес-логика) — файл: backend/apps/pricing/services.py

class PricingService:
- calculate_fare(service_id, distance_km, duration_min, surcharge_ids=[]):
    1. Получить Tariff по service_id (select_related service)
    2. Посчитать базовую цену через tariff.calculate_price(distance_km, duration_min)
    3. Применить надбавки (Surcharge.objects.filter(id__in=surcharge_ids, is_active=True))
    4. Вернуть {"base_price": ..., "surcharges_total": ..., "total_price": ..., "currency": "сомони"}

- get_all_services_with_pricing():
    Вернуть все активные сервисы с тарифами и привязанными надбавками (для клиентского приложения).
    Использовать select_related("tariff") и prefetch_related("surcharges").

### 1.3 Сериализаторы — файл: backend/apps/pricing/serializers/

**SurchargeSerializer** (surcharge.py):
- fields: id, name, type, value, is_active, sort_order

**TariffSerializer** (tariff.py):
- fields: id, base_price, price_per_km, price_per_min, min_price, is_active

**ServiceListSerializer** (service.py) — для клиента:
- fields: id, name, description, icon, tariff (nested TariffSerializer), surcharges (nested SurchargeSerializer, many=True)
- tariff и surcharges — read_only, вложенные

**ServiceAdminSerializer** (service.py) — для админки, CRUD:
- fields: id, name, description, icon, sort_order, is_active, created_at

**TariffAdminSerializer** (tariff.py) — для админки:
- fields: id, service (PK), base_price, price_per_km, price_per_min, min_price, is_active

**SurchargeAdminSerializer** (surcharge.py) — для админки:
- fields: id, name, type, value, services (PK many=True), is_active, sort_order

**CalculatePriceSerializer** (pricing.py) — запрос расчёта:
- service_id: UUIDField()
- distance_km: FloatField()
- duration_min: FloatField()
- surcharge_ids: ListField(child=UUIDField(), required=False, default=[])

**CalculatePriceResponseSerializer** — ответ:
- base_price, surcharges_total, total_price: DecimalField
- currency: CharField

### 1.4 Views — файл: backend/apps/pricing/views/

**ServiceListView** (GET, AllowAny) — публичный список сервисов с тарифами для клиента
**CalculatePriceView** (POST, AllowAny) — расчёт стоимости

**Админские ViewSets** (IsAdmin permission):
- ServiceAdminViewSet — CRUD сервисов (ModelViewSet)
- TariffAdminViewSet — CRUD тарифов (ModelViewSet)
- SurchargeAdminViewSet — CRUD надбавок (ModelViewSet)

### 1.5 URLs — файл: backend/apps/pricing/urls.py

Публичные:
- GET  /api/v1/pricing/services/          → ServiceListView
- POST /api/v1/pricing/calculate/         → CalculatePriceView

Админские:
- /api/v1/pricing/admin/services/         → ServiceAdminViewSet (router)
- /api/v1/pricing/admin/tariffs/          → TariffAdminViewSet (router)
- /api/v1/pricing/admin/surcharges/       → SurchargeAdminViewSet (router)

### 1.6 Admin — файл: backend/apps/pricing/admin.py

Зарегистрировать все три модели в Django Admin:
- ServiceAdmin: list_display=[name, sort_order, is_active], inline для Tariff
- TariffAdmin: list_display=[service, base_price, price_per_km, price_per_min, min_price]
- SurchargeAdmin: list_display=[name, type, value, is_active], filter_horizontal для services

### 1.7 Миграции

После создания моделей запусти:
python manage.py makemigrations pricing
python manage.py migrate

---

## 2. ADMIN PANEL (React + Vite + Ant Design)

Создай в admin-panel/src/ следующие файлы:

### 2.1 API слой — admin-panel/src/api/pricing.ts

Функции:
- getServices() → GET /api/v1/pricing/admin/services/
- getService(id) → GET /api/v1/pricing/admin/services/{id}/
- createService(data) → POST
- updateService(id, data) → PUT
- deleteService(id) → DELETE
- getTariffs(), createTariff(data), updateTariff(id, data), deleteTariff(id)
- getSurcharges(), createSurcharge(data), updateSurcharge(id, data), deleteSurcharge(id)

React Query hooks в admin-panel/src/api/hooks/usePricing.ts:
- useServices(), useCreateService(), useUpdateService(), useDeleteService()
- useTariffs(), useCreateTariff(), useUpdateTariff(), useDeleteTariff()
- useSurcharges(), useCreateSurcharge(), useUpdateSurcharge(), useDeleteSurcharge()

### 2.2 Страница Сервисов — admin-panel/src/pages/pricing/ServicesPage.tsx

Ant Design таблица (Table) со столбцами:
- Иконка (Avatar), Название, Описание, Порядок, Активен (Switch), Действия (Edit/Delete)

Кнопка «Добавить сервис» → Modal с формой (Form):
- name (Input), description (TextArea), icon (Upload), sort_order (InputNumber), is_active (Switch)

При клике Edit → тот же Modal с заполненными данными.
При Delete → Popconfirm → удаление.

### 2.3 Страница Тарифов — admin-panel/src/pages/pricing/TariffsPage.tsx

Таблица:
- Сервис (Select из списка сервисов), Базовая цена, Цена/км, Цена/мин, Мин. цена, Активен, Действия

Modal для создания/редактирования:
- service (Select — список сервисов без тарифа), base_price, price_per_km, price_per_min, min_price (InputNumber с суффиксом «сомони»), is_active (Switch)

### 2.4 Страница Надбавок — admin-panel/src/pages/pricing/SurchargesPage.tsx

Таблица:
- Название, Тип (Tag — «Фиксированная»/«Процент»), Значение, Сервисы (Tags), Активна, Действия

Modal:
- name (Input), type (Radio — "fixed"/"percent"), value (InputNumber), services (Select multiple из списка сервисов), is_active (Switch)

### 2.5 Роутинг

Добавь в router.tsx:
- /pricing/services → ServicesPage
- /pricing/tariffs → TariffsPage
- /pricing/surcharges → SurchargesPage

Добавь в Sidebar меню группу «Тарифы» с тремя подпунктами.

### 2.6 Общий стиль

Все тексты на русском. Используй antd компоненты: Table, Modal, Form, Input, InputNumber, Select, Switch, Upload, Popconfirm, Tag, message (для toast-уведомлений).

---

## 3. MOBILE — Passenger App (React Native)

### 3.1 API — mobile/passenger-app/src/api/pricing.ts

- getServices() → GET /api/v1/pricing/services/
- calculatePrice(service_id, distance_km, duration_min, surcharge_ids) → POST /api/v1/pricing/calculate/

React Query hooks в api/hooks/usePricing.ts:
- useServices() — загрузить список сервисов с тарифами
- useCalculatePrice() — useMutation для расчёта

### 3.2 Компоненты — mobile/passenger-app/src/components/pricing/

**ServiceCard.tsx** — карточка одного сервиса:
- Иконка (Image), название, описание
- Цена «от X сомони» (min_price из тарифа)
- Выделение при выборе (border/background)
- onPress → выбрать сервис

**ServiceSelector.tsx** — горизонтальный ScrollView/FlatList:
- Список ServiceCard
- Текущий выбранный сервис подсвечен
- Под списком показать детали тарифа выбранного сервиса:
  «Посадка: X сом | За км: X сом | Ожидание: X сом/мин»

**SurchargeSelector.tsx** — список надбавок для выбранного сервиса:
- Каждая надбавка — Chip/Toggle (включить/выключить)
- Показать стоимость: «+X сом» или «+X%»

**PriceBreakdown.tsx** — итоговая стоимость:
- Базовая: X сом
- Надбавки: +Y сом (расписать каждую)
- Итого: Z сом (жирным, крупным)

### 3.3 Интеграция в OrderScreen

В mobile/passenger-app/src/screens/ride/OrderScreen.tsx добавь:
1. ServiceSelector вверху (после карты с маршрутом)
2. SurchargeSelector под ним (только если есть надбавки у сервиса)
3. PriceBreakdown внизу
4. Кнопка «Заказать за Z сомони»

При выборе сервиса или надбавки → вызвать useCalculatePrice → обновить PriceBreakdown.

### 3.4 Store

В mobile/passenger-app/src/store/useOrderStore.ts добавь поля:
- selectedServiceId: string | null
- selectedSurchargeIds: string[]
- calculatedPrice: { base_price, surcharges_total, total_price } | null
- setService(id), toggleSurcharge(id), setCalculatedPrice(data), reset()

---

## ВАЖНО:

1. Следуй архитектуре из скилла taxi-app: fat services, thin views.
2. Backend: каждый файл модели в отдельном файле, реэкспорт в __init__.py.
3. Все тексты UI на русском языке.
4. Admin panel: TypeScript, Ant Design 5, React Query для кэширования.
5. Mobile: TypeScript, Zustand для стейта, React Query для API.
6. Валидация: тариф не может существовать без сервиса; при удалении сервиса удалять тариф (CASCADE).
7. Сначала создай backend, проверь что migrate проходит, потом admin, потом mobile.
```

---

## Ожидаемый результат

После выполнения этого промпта у тебя будет:

### Backend (8 новых/изменённых файлов):
```
backend/apps/pricing/
├── models/
│   ├── __init__.py          ← реэкспорт Service, Tariff, Surcharge
│   ├── service.py           ← NEW
│   ├── tariff.py            ← UPDATED (добавлен calculate_price)
│   └── surcharge.py         ← NEW
├── serializers/
│   ├── service.py           ← NEW
│   ├── tariff.py            ← NEW
│   ├── surcharge.py         ← NEW
│   └── pricing.py           ← NEW (calculate request/response)
├── views/
│   ├── public.py            ← NEW (ServiceListView, CalculatePriceView)
│   └── admin.py             ← NEW (3 ViewSets)
├── services.py              ← UPDATED
├── urls.py                  ← UPDATED
├── admin.py                 ← UPDATED
└── migrations/
    └── 0001_initial.py      ← AUTO
```

### Admin Panel (5 новых файлов):
```
admin-panel/src/
├── api/
│   ├── pricing.ts           ← NEW
│   └── hooks/usePricing.ts  ← NEW
└── pages/pricing/
    ├── ServicesPage.tsx      ← NEW
    ├── TariffsPage.tsx       ← NEW
    └── SurchargesPage.tsx    ← NEW
```

### Mobile Passenger App (6 новых файлов):
```
mobile/passenger-app/src/
├── api/
│   ├── pricing.ts           ← NEW
│   └── hooks/usePricing.ts  ← NEW
├── components/pricing/
│   ├── ServiceCard.tsx       ← NEW
│   ├── ServiceSelector.tsx   ← NEW
│   ├── SurchargeSelector.tsx ← NEW
│   └── PriceBreakdown.tsx    ← NEW
└── store/useOrderStore.ts    ← NEW/UPDATED
```
