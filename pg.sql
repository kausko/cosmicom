CREATE TABLE "orders" (
  "id" int PRIMARY KEY,
  "user_id" int UNIQUE NOT NULL,
  "status" varchar,
  "created_at" date,
  "netAmt" bigint,
  "paymentMode" varchar,
  "shipper_id" int
);

CREATE TABLE "order_items" (
  "order_id" int,
  "product_id" int,
  "quantity" int
);

CREATE TABLE "products" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "merchant_id" int NOT NULL,
  "price" int,
  "status" varchar,
  "created_at" date,
  "category_id" int
);

CREATE TABLE "users" (
  "id" int PRIMARY KEY,
  "full_name" varchar,
  "email" varchar UNIQUE,
  "gender" varchar,
  "phone" varchar,
  "walletAmt" bigint,
  "date_of_birth" date,
  "created_at" date,
  "country_code" int,
  "password" varchar
);

CREATE TABLE "merchants" (
  "id" int PRIMARY KEY,
  "admin_id" int,
  "merchant_name" varchar,
  "website" varchar,
  "country_code" int,
  "created_at" date,
  "emp_id" int NOT NULL,
  "password" varchar
);

CREATE TABLE "categories" (
  "id" int PRIMARY KEY,
  "cat_name" varchar,
  "parent_id" int
);

CREATE TABLE "countries" (
  "code" int PRIMARY KEY,
  "name" varchar,
  "continent_name" varchar
);

CREATE TABLE "employees" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "email" varchar UNIQUE,
  "salary" bigint,
  "phone" varchar,
  "date_of_birth" date,
  "created_at" date,
  "country_code" int,
  "password" varchar
);

CREATE TABLE "shippers" (
  "id" int PRIMARY KEY,
  "name" varchar,
  "email" varchar,
  "website" varchar,
  "country_code" int,
  "created_at" date,
  "password" varchar
);

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("merchant_id") REFERENCES "merchants" ("id");

ALTER TABLE "products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "categories" ADD FOREIGN KEY ("parent_id") REFERENCES "categories" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("country_code") REFERENCES "countries" ("code");

ALTER TABLE "merchants" ADD FOREIGN KEY ("admin_id") REFERENCES "users" ("id");

ALTER TABLE "merchants" ADD FOREIGN KEY ("country_code") REFERENCES "countries" ("code");

ALTER TABLE "employees" ADD FOREIGN KEY ("country_code") REFERENCES "countries" ("code");

ALTER TABLE "merchants" ADD FOREIGN KEY ("emp_id") REFERENCES "employees" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("shipper_id") REFERENCES "shippers" ("id");
