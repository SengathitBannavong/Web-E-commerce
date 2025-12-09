import React from 'react'
import { useParams } from 'react-router-dom';
import { BESTSELLERS } from '../data/bestsellers';
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from '../contexts/CartContext'; // <<< QUAN TRỌNG

const BookDetail = () => {
    const { id } = useParams();

    // Ép kiểu thành number
    const book = BESTSELLERS.find((b) => b.id ==id);

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            id: book.id,
            title: book.title,
            price: book.price,
            cover: book.cover,
            author: book.author,
            badge: book.badge,
        });
    };

    return (
        <div className='flex justify-center items-center m-10 p-4'>
            <div><div className='m-4'>
                <h2>{book.title}</h2>
                <p><b>Author:</b> {book.author}</p>
                <p><b>Description:</b> {book.description}</p>
                <p><b>Badge:</b> {book.badge}</p>
                <p><b>Price:</b> {book.price}</p>
            </div>
                <button 
                    onClick={handleAddToCart} // gắn onClick cho cả button
                    className='btn-primary px-6 space-x-1 flex items-center gap-1'
                >
                    <FaShoppingCart size={24} />
                        <p>Add cart</p>
                </button>
            </div>
            <div>
                <img className='w-50 h-auto rounded-lg shadow-lg' src={book.cover} alt={book.title} />
            </div>
        </div>
    );
}

export default BookDetail;
