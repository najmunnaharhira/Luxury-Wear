
-- Create products table
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  original_price TEXT,
  description TEXT NOT NULL DEFAULT '',
  details TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  sizes TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT '',
  is_new BOOLEAN NOT NULL DEFAULT false,
  is_sale BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can view products
CREATE POLICY "Anyone can view products"
ON public.products
FOR SELECT
USING (true);

-- Admins can manage products
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed with existing static products
INSERT INTO public.products (id, name, price, original_price, description, details, images, sizes, category, is_new, is_sale) VALUES
(1, 'Leather Knee-High Boots', '€385', '€550', 'Handcrafted Italian leather knee-high boots with a sleek silhouette. Features a comfortable block heel and soft leather lining for all-day wear.', ARRAY['100% Italian calfskin leather','Leather sole with rubber insert','Block heel: 7cm','Side zip closure','Made in Italy'], ARRAY['/product-boots-1.jpg','/product-boots-2.jpg','/product-boots-3.jpg'], ARRAY['35','36','37','38','39','40','41','42'], 'Boots', true, true),
(2, 'Chelsea Ankle Boots', '€295', '€420', 'Classic Chelsea boots reimagined with modern proportions. Elastic side panels for easy on/off and a comfortable stacked heel.', ARRAY['Premium suede upper','Leather lining','Stacked leather heel: 4cm','Elastic side panels','Made in Italy'], ARRAY['/product-boots-2.jpg','/product-boots-1.jpg','/product-boots-3.jpg'], ARRAY['36','37','38','39','40','41'], 'Boots', true, true),
(3, 'Platform Chunky Sneakers', '€265', '€380', 'Bold platform sneakers with chunky sole and premium leather construction. A statement piece for the modern wardrobe.', ARRAY['Full-grain leather upper','Cushioned insole','Platform height: 5cm','Rubber outsole','Made in Italy'], ARRAY['/product-sneaker-1.jpg','/product-boots-1.jpg','/product-loafer-1.jpg'], ARRAY['35','36','37','38','39','40'], 'Sneakers', false, true),
(4, 'Suede Horsebit Loafers', '€320', '€460', 'Timeless horsebit loafers in luxurious suede. The perfect blend of casual elegance for any occasion.', ARRAY['Italian suede upper','Gold-tone horsebit hardware','Leather lining and sole','Heel: 2.5cm','Made in Italy'], ARRAY['/product-loafer-1.jpg','/product-sneaker-1.jpg','/product-boots-2.jpg'], ARRAY['36','37','38','39','40','41','42'], 'Loafers', false, true),
(5, 'Combat Lace-Up Boots', '€425', NULL, 'Military-inspired combat boots with premium leather and heavy-duty construction. Features padded collar and cushioned footbed.', ARRAY['Full-grain leather upper','Padded collar','Chunky rubber sole','Lace-up closure with speed hooks','Made in Italy'], ARRAY['/product-boots-3.jpg','/product-boots-1.jpg','/product-boots-2.jpg'], ARRAY['35','36','37','38','39','40','41'], 'Boots', true, false);

-- Reset sequence
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
