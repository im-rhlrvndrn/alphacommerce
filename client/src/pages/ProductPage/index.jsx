import axios from '../../axios';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { useTheme } from '../../context/ThemeProvider';
import { findIndex, getSelectedVariantPrice } from '../../utils';

// styles
import './productpage.scss';

// React components
import { AddToCart } from '../../components/Buttons';

export const ProductPage = () => {
    const { theme } = useTheme();
    const [{ currentUser }, authDispatch] = useAuth();
    const urlParams = useParams();
    const [book, setBook] = useState(null);

    const fetchBookDetails = async () => {
        try {
            const {
                data: { success, data },
            } = await axios.get(`/books/${urlParams.id}`);
            if (success)
                setBook(() => ({
                    ...data.book,
                    variants: data.book.variants.map((variant) =>
                        variant.type === 'paperback'
                            ? { ...variant, isSelected: true }
                            : { ...variant, isSelected: false }
                    ),
                }));
        } catch (error) {
            console.error(error);
        }
    };

    const selectVariant = (variantId) =>
        setBook((prevState) => ({
            ...prevState,
            variants: prevState.variants.map((item) =>
                item._id === variantId
                    ? { ...item, isSelected: true }
                    : { ...item, isSelected: false }
            ),
        }));

    useEffect(() => {
        console.log(
            `---- Re-rendered the Product Page => selected variant is "${
                book?.variants[findIndex(book?.variants, 'isSelected')].type
            }"----`
        );
    }, [book?.variants, currentUser]);

    useEffect(() => {
        fetchBookDetails();
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
                style={{ backgroundColor: theme.dark_background, color: theme.color }}>
                <div className='product-page-hero'>
                    <img src={book?.cover_image?.url} alt={book?.name} />
                    <div className='product-page-hero-content'>
                        <h1 className='text-2xl mb-4'>
                            <a
                                href={book?.external_urls?.amazon}
                                target='_blank'
                                style={{ color: theme.color }}>
                                {book?.name}
                            </a>
                        </h1>
                        <p className='authors mb-8'>By {book?.authors?.join(', ')}</p>
                        <div className='variant_container flex mb-8'>
                            {book?.variants?.map((variant) => (
                                <button
                                    key={variant._id}
                                    className={`variant flex items-center p-4 br-5 ${
                                        variant.isSelected ? 'active' : ''
                                    }`}
                                    style={{
                                        color: theme.color,
                                        backgroundColor: theme.light_background,
                                        border: variant.isSelected
                                            ? `2px solid ${theme.constants.primary}`
                                            : '',
                                    }}
                                    onClick={() => selectVariant(variant._id)}>
                                    {variant?.type}
                                </button>
                            ))}
                        </div>
                        <h2 className='mb-8 text-xl'>
                            ₹{' '}
                            {book?.variants?.length &&
                                getSelectedVariantPrice(
                                    book?.variants,
                                    book.variants[findIndex(book.variants, 'isSelected')].type
                                )}
                        </h2>
                        <div className='cta-buttons flex mb-8'>
                            {book && (
                                <AddToCart
                                    item={book}
                                    variant={
                                        book?.variants[findIndex(book?.variants, 'isSelected')]
                                    }
                                />
                            )}
                            <button
                                className='text-s font-semibold'
                                style={{
                                    backgroundColor: theme.constants.primary,
                                    color: theme.constants.dark,
                                }}>
                                Get A Copy
                            </button>
                        </div>
                        <p className='summary'>By {book?.summary?.text}</p>
                    </div>
                </div>
            </div>
        </>
    );
};
