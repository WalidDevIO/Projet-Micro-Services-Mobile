DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            description TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE articles (
                          id INT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          price DECIMAL(10, 2) NOT NULL,
                          stock INT NOT NULL DEFAULT 0,
                          category_id INT,
                          image_url VARCHAR(500),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_items (
                            id INT AUTO_INCREMENT PRIMARY KEY,
                            user_id INT NOT NULL,
                            article_id INT NOT NULL,
                            quantity INT NOT NULL,
                            price_at_add DECIMAL(10, 2) NOT NULL,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
                            UNIQUE(user_id, article_id)
) ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des catégories
INSERT INTO categories (name, description) VALUES
                                               ('Électronique', 'Smartphones, ordinateurs, accessoires tech'),
                                               ('Vêtements', 'Mode homme, femme, accessoires'),
                                               ('Maison & Jardin', 'Décoration, meubles, outils de jardinage'),
                                               ('Sports & Loisirs', 'Équipements sportifs, jeux, hobbies');

-- Insertion des articles
INSERT INTO articles (name, description, price, stock, category_id, image_url) VALUES
-- Électronique (prix élevés, stock varié)
('iPhone 15 Pro Max', 'Smartphone Apple dernière génération, 256GB', 1299.99, 12, 1, 'https://picsum.photos/seed/iphone/400/400'),
('MacBook Air M3', 'Ordinateur portable ultra-fin, puce M3, 16GB RAM', 1499.00, 3, 1, 'https://picsum.photos/seed/macbook/400/400'),
('AirPods Pro 2', 'Écouteurs sans fil avec réduction de bruit active', 279.99, 45, 1, 'https://picsum.photos/seed/airpods/400/400'),
('Samsung Galaxy S24', 'Smartphone Android flagship, 128GB', 899.00, 0, 1, 'https://picsum.photos/seed/samsung/400/400'),
('Clavier Mécanique RGB', 'Clavier gaming avec switches Cherry MX', 149.99, 8, 1, 'https://picsum.photos/seed/keyboard/400/400'),

-- Vêtements (prix moyens, stock varié)
('T-Shirt Basique Noir', 'Coton bio, coupe régulière, unisexe', 19.99, 150, 2, 'https://picsum.photos/seed/tshirt/400/400'),
('Jean Slim Bleu', 'Denim stretch, coupe ajustée', 59.90, 42, 2, 'https://picsum.photos/seed/jeans/400/400'),
('Veste en Cuir', 'Cuir véritable, doublure intérieure', 299.00, 5, 2, 'https://picsum.photos/seed/jacket/400/400'),
('Sneakers Running', 'Chaussures de course légères, semelle amortissante', 89.99, 0, 2, 'https://picsum.photos/seed/sneakers/400/400'),
('Casquette Baseball', '100% coton, ajustable', 24.99, 87, 2, 'https://picsum.photos/seed/cap/400/400'),

-- Maison & Jardin (prix variés, stock varié)
('Chaise de Bureau Ergonomique', 'Support lombaire, hauteur ajustable, roulettes', 179.00, 15, 3, 'https://picsum.photos/seed/chair/400/400'),
('Lampe LED Design', 'Éclairage indirect, température de couleur réglable', 45.50, 28, 3, 'https://picsum.photos/seed/lamp/400/400'),
('Set de Couteaux 5 pièces', 'Acier inoxydable, support en bambou inclus', 79.99, 1, 3, 'https://picsum.photos/seed/knives/400/400'),
('Aspirateur Robot', 'Navigation intelligente, compatible app mobile', 349.99, 7, 3, 'https://picsum.photos/seed/vacuum/400/400'),

-- Sports & Loisirs (prix bas à moyens, stock varié)
('Tapis de Yoga', 'Antidérapant, 6mm épaisseur, sac de transport inclus', 29.99, 63, 4, 'https://picsum.photos/seed/yoga/400/400'),
('Haltères 2x10kg', 'Revêtement néoprène, ergonomiques', 49.90, 0, 4, 'https://picsum.photos/seed/dumbbells/400/400'),
('Raquette de Tennis', 'Graphite composite, grip confort', 119.00, 11, 4, 'https://picsum.photos/seed/racket/400/400'),
('Ballon de Football', 'Taille 5, FIFA approved, coutures thermocollées', 34.99, 4, 4, 'https://picsum.photos/seed/ball/400/400');