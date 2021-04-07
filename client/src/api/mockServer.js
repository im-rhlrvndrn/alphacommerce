import { createServer, Model, RestSerializer } from 'miragejs';
import { productData } from '../data';

export const makeServer = () => {
    createServer({
        serializers: {
            application: RestSerializer,
        },

        models: {
            cart: Model,
            genre: Model,
            author: Model,
            product: Model,
            readlist: Model,
        },

        routes() {
            this.namespace = 'api';
            // this.timing = 3000;
            this.resource('carts');
            this.resource('genres');
            this.resource('authors');
            this.resource('products');
            this.resource('readlists');

            // this.get('/products', (schema) => schema.products.all());
        },

        seeds(server) {
            productData.forEach((product) => {
                server.create('product', { ...product });

                product.genre.map((genreData) => {
                    const genreExists = server.schema.genres.findBy({ name: genreData });
                    if (genreExists) return;
                    server.create('genre', { name: genreData });
                });

                product.authors.map((authorData) => {
                    const authorExists = server.schema.authors.findBy({ name: authorData });
                    if (authorExists) return;
                    server.create('author', { name: authorData });
                });
            });
        },
    });
};
