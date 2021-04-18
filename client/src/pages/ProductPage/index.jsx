import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeProvider';

// styles
import './productpage.scss';

// React components
import { AddToCart } from '../../components/Buttons';

export const ProductPage = () => {
    const { theme } = useTheme();
    const urlParams = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`/api/products/${urlParams.id}`)
            .then((res) => res.json())
            .then((response) => {
                console.log('Product details: ', response.product);
                setProduct((prevState) => response.product);
            });
    }, []);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    }, []);

    return (
        <>
            <div
                className='product-page'
                style={{ backgroundColor: theme.dark_background, color: theme.color }}
            >
                <div className='product-page-hero'>
                    <img src={product?.coverImage?.url} alt={product?.name} />
                    <div className='product-page-hero-content'>
                        <h1>
                            <a
                                href={product?.link?.url?.text}
                                target='_blank'
                                style={{ color: theme.color }}
                            >
                                {product?.name}
                            </a>
                        </h1>
                        <p className='authors'>By {product?.authors?.join(', ')}</p>
                        <h2 className='price'>₹ {product?.price?.value}</h2>
                        <div className='cta-buttons'>
                            {product && <AddToCart item={product} />}
                            <button
                                style={{
                                    backgroundColor: theme.constants.primary,
                                    color: theme.constants.dark,
                                }}
                            >
                                Get A Copy
                            </button>
                        </div>
                        <p className='summary'>By {product?.summary?.text}</p>
                    </div>
                </div>
            </div>
        </>
    );
};
