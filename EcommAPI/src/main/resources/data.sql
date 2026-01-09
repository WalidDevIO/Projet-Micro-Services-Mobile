DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
                            id INTEGER PRIMARY KEY,
                            name VARCHAR(100) NOT NULL,
                            description TEXT,
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS articles
CREATE TABLE articles (
                          id INTEGER PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          price DECIMAL(10, 2) NOT NULL,
                          stock INTEGER NOT NULL DEFAULT 0,
                          category_id BIGINT,
                          image_url VARCHAR(500),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS cart_items;
CREATE TABLE cart_items (
                            id INTEGER PRIMARY KEY,
                            user_id BIGINT NOT NULL,
                            article_id BIGINT NOT NULL,
                            quantity INTEGER NOT NULL,
                            price_at_add DECIMAL(10, 2) NOT NULL, -- prix au moment de l'ajout
                            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
                            UNIQUE(cart_id, article_id)
);