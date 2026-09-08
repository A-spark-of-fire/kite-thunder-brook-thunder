create table if not exists profiles (
  user_id text primary key,
  role text not null default 'customer',
  full_name text not null default '',
  mobile text not null default '',
  alt_mobile text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_role_idx on profiles (role);

create table if not exists addresses (
  id serial primary key,
  user_id text not null,
  label text not null default 'Home',
  line1 text not null,
  line2 text not null default '',
  city text not null,
  state text not null default 'West Bengal',
  pincode text not null,
  landmark text not null default '',
  is_default boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists addresses_user_id_idx on addresses (user_id);

create table if not exists products (
  id serial primary key,
  name text not null,
  size_label text not null,
  size_ml integer not null default 0,
  unit_price numeric(10,2) not null,
  description text not null default '',
  art_key text not null default 'jar',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists payment_methods (
  id text primary key,
  label text not null,
  description text not null default '',
  enabled boolean not null default false,
  sort_order integer not null default 0
);

create table if not exists agency_settings (
  id integer primary key default 1,
  brand_name text not null default 'SUPEYO',
  company_name text not null default 'Kalpataru Soft Drinks and Enterprise',
  proprietor text not null default 'Ananda Hazra',
  phone_primary text not null default '8617297495',
  phone_secondary text not null default '8967648044',
  email text not null default 'kalpatarusoftDrinksenterprise@gmail.com',
  address_line text not null default 'Kalinarayanpur, P.O. Kalinarayapure, P.S. Taherpur, Dist. Nadia, PIN 741254, West Bengal',
  fssai text not null default '12826012000290',
  upi_id text not null default ''
);

create table if not exists delivery_agents (
  id serial primary key,
  name text not null,
  phone text not null,
  is_active boolean not null default true
);

create sequence if not exists order_number_seq start with 1025;

create table if not exists orders (
  id serial primary key,
  order_number text not null unique,
  user_id text not null,
  status text not null default 'placed',
  address_snapshot jsonb not null,
  preferred_date date not null,
  time_slot text not null,
  note text not null default '',
  payment_method text not null default 'cod',
  payment_status text not null default 'pending',
  subtotal numeric(10,2) not null,
  total numeric(10,2) not null,
  assigned_agent_id integer,
  expected_date date,
  delivered_at timestamptz,
  cancelled_at timestamptz,
  cancel_reason text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_id_idx on orders (user_id);
create index if not exists orders_status_idx on orders (status);

create table if not exists order_items (
  id serial primary key,
  order_id integer not null references orders(id) on delete cascade,
  product_id integer,
  product_name text not null,
  size_label text not null,
  unit_price numeric(10,2) not null,
  quantity integer not null,
  line_total numeric(10,2) not null
);
create index if not exists order_items_order_id_idx on order_items (order_id);

create table if not exists order_status_history (
  id serial primary key,
  order_id integer not null references orders(id) on delete cascade,
  status text not null,
  note text not null default '',
  created_by text not null default 'system',
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id serial primary key,
  order_id integer not null references orders(id) on delete cascade,
  method text not null,
  amount numeric(10,2) not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id serial primary key,
  user_id text not null,
  title text not null,
  body text not null,
  order_id integer,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_id_idx on notifications (user_id, is_read, created_at desc);

create table if not exists contact_messages (
  id serial primary key,
  user_id text,
  name text not null,
  phone text not null,
  email text not null default '',
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists password_reset_requests (
  id serial primary key,
  email text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

insert into products (name, size_label, size_ml, unit_price, description, art_key, is_active, sort_order)
select * from (values
  ('20 Litre Water Jar', '20 Litre', 20000, 90.00, 'Family jar for home and office dispensers.', 'jar20', true, 1),
  ('10 Litre Water Jar', '10 Litre', 10000, 55.00, 'Compact jar for smaller households.', 'jar10', true, 2),
  ('5 Litre Water Bottle', '5 Litre', 5000, 35.00, 'Handle bottle for kitchens and shops.', 'bottle5', true, 3),
  ('1 Litre Bottle Pack', '1 Litre × 12', 12000, 180.00, 'Case of twelve 1-litre bottles.', 'pack1', true, 4)
) as v(name, size_label, size_ml, unit_price, description, art_key, is_active, sort_order)
where not exists (select 1 from products);

insert into payment_methods (id, label, description, enabled, sort_order)
values
  ('cod', 'Cash on Delivery', 'Pay the delivery person in cash when your water arrives.', true, 1),
  ('upi', 'UPI', 'Pay with GPay, PhonePe, or any UPI app.', true, 2),
  ('card', 'Card Payment', 'Debit or credit card at delivery or online.', false, 3),
  ('online', 'Online Payment', 'Pay securely online before dispatch.', false, 4)
on conflict (id) do nothing;

insert into agency_settings (id) values (1) on conflict (id) do nothing;

insert into delivery_agents (name, phone, is_active)
select * from (values
  ('Raju Mondal', '8617297495', true),
  ('Sourav Ghosh', '8967648044', true)
) as v(name, phone, is_active)
where not exists (select 1 from delivery_agents);
