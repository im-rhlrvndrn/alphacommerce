// styles
import './listingproducts.scss';

// React components
import { CategoryListItem } from '../../CategoryList/CategoryListitem';

export const ListingProducts = ({ products }) => {
    return (
        <div className='listing-container'>
            {products.map((product) => (
                <CategoryListItem key={product.id} item={product} />
            ))}
        </div>
    );
};
