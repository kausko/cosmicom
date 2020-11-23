CREATE TABLE "orders" (
  "id" varchar PRIMARY KEY,
  "user_id" varchar NOT NULL,
  "status" varchar,
  "created_at" date,
  "netAmt" bigint,
  "paymentMode" varchar,
  "shipper_id" varchar
);

CREATE TABLE "order_items" (
  "order_id" varchar,
  "product_id" varchar,
  "quantity" int
);

CREATE TABLE "products" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "merchant_id" varchar NOT NULL,
  "price" bigint,
  "status" varchar,
  "created_at" date,
  "category_id" varchar
);

CREATE TABLE "users" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "email" varchar UNIQUE,
  "gender" varchar,
  "phone" varchar,
  "walletAmt" bigint,
  "date_of_birth" date,
  "created_at" date,
  "country_code" varchar,
  "password" varchar
);

CREATE TABLE "merchants" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "email" varchar UNIQUE,
  "website" varchar,
  "country_code" varchar,
  "created_at" date,
  "emp_id" varchar NOT NULL,
  "password" varchar
);

CREATE TABLE "categories" (
  "id" varchar PRIMARY KEY,
  "cat_name" varchar,
  "parent_id" varchar
);

CREATE TABLE "countries" (
  "code" varchar PRIMARY KEY,
  "name" varchar,
  "dial_code" varchar
);UNIQUE

CREATE TABLE "employees" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "email" varchar UNIQUE,
  "phone" varchar,
  "date_of_birth" date,
  "created_at" date,
  "country_code" varchar,
  "password" varchar
);

CREATE TABLE "shippers" (
  "id" varchar PRIMARY KEY,
  "name" varchar,
  "email" varchar UNIQUE,
  "website" varchar,
  "country_code" int,
  "created_at" date,
  "password" varchar,
  "emp_id" varchar [not null]
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

ALTER TABLE "shippers" ADD FOREIGN KEY ("emp_id") REFERENCES "employees" ("id");

WITH RECURSIVE
c_with_level AS (
    
    SELECT *, 0 as lvl
    FROM   categories
    WHERE  parent_id IS NULL

    UNION ALL
    
    SELECT child.*, parent.lvl + 1
    FROM   categories child
    JOIN   c_with_level parent ON parent.id = child.parent_id
),
maxlvl AS (
  SELECT max(lvl) maxlvl FROM c_with_level
),
c_tree AS (
    SELECT c_with_level.*, jsonb '[]' children
    FROM   c_with_level, maxlvl
    WHERE  lvl = maxlvl

    UNION 
    (
        SELECT (branch_parent).*, jsonb_agg(branch_child)
        FROM (
            SELECT branch_parent, branch_child
            FROM c_with_level branch_parent
            JOIN c_tree branch_child ON branch_child.parent_id = branch_parent.id
        ) branch
        GROUP BY branch.branch_parent
            
        UNION
            
        SELECT c.*, jsonb '[]' children
        FROM   c_with_level c
        WHERE  NOT EXISTS (SELECT 1 FROM c_with_level hypothetical_child WHERE hypothetical_child.parent_id = c.id)
    )
)
SELECT jsonb_pretty(row_to_json(c_tree)::jsonb)
FROM c_tree
WHERE lvl = 0;