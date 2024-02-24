"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from 'antd';
import Image from "next/image";
import axios from 'axios';

function Store({ id }) {
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStore = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/store/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setStore(response.data.data[0]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching store:', error);
                setLoading(false);
            }
        };

        fetchStore();
    }, [id]);
    console.log(store);
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Store Information</h1>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="flex justify-between">
                    <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Bank Name:</label>
                        <p className="text-gray-700">{store.bankName}</p>
                    </div>
                    <Link href="/store/edit-store">
                        <Button type="primary" color="blue" className='py-5 px-3 flex gap-3 justify-center items-center'>

                            <Image
                                src={`/images/edit.png`}
                                alt={`edit`}
                                height={15}
                                width={15}
                            />
                            <span>Edit</span>

                        </Button>
                    </Link>
                </div>

                <div className="mb-8">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Bank Account:</label>
                    <p className="text-gray-700">{store.bankAccount}</p>
                </div>
                <div className="mb-8">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                    <p className="text-gray-700">{store.address}</p>
                </div>
                <div className="mb-8">
                    <label className="block text-gray-700 text-sm font-bold mb-2">City:</label>
                    <p className="text-gray-700">{store.city}</p>
                </div>
                <div className="mb-8">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Province:</label>
                    <p className="text-gray-700">{store.province}</p>
                </div>
            </div>
        </div>

    );
}

export default Store;
