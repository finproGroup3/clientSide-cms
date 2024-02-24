"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Select, Option } from "@material-tailwind/react";
import { Checkbox } from 'antd';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const AddPromoPage = () => {
    const [formData, setFormData] = useState({
        code: '',
        percentage: '',
        quota: '',
        isActive: true, // Default value for isActive
        isGlobal: false, // Default value for isGlobal
        description: '',
        productIds: [],
        allProducts: [] // to store all products fetched from the API
    });

    const router = useRouter();

    const fetchAllProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/product/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFormData(prevState => ({
                ...prevState,
                allProducts: response.data.data
            }));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const handleChangeCategory = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (productId) => {
        if (formData.productIds.includes(productId)) {
            setFormData(prevState => ({
                ...prevState,
                productIds: formData.productIds.filter(id => id !== productId)
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                productIds: [...formData.productIds, productId]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}/promo`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Promo added successfully',
            }).then(() => {
                router.push('/promo');
            });
        } catch (error) {
            console.error('Error adding promo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add promo',
            });
        }
    };

    return (
        <div className='p-5'>
            <div className="p-8 w-[100%] h-[100%] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <h1 className="text-2xl font-semibold mb-4">Add Promo</h1>
                <form onSubmit={handleSubmit} className=''>
                    <div className="mb-4">
                        <Input type="text" name="code" value={formData.code} onChange={handleChange} label="Code" />
                    </div>
                    <div className="mb-4">
                        <Input type="number" name="percentage" value={formData.percentage} onChange={handleChange} label="Percentage" />
                    </div>
                    <div className="mb-4">
                        <Input type="number" name="quota" value={formData.quota} onChange={handleChange} label="Quota" />
                    </div>
                    <div className="mb-4">
                        <Input type="text" name="description" value={formData.description} onChange={handleChange} label="Description" />
                    </div>
                    <div className="mb-4">
                        <Select value={formData.isActive} onChange={(value) => handleChangeCategory('isActive', value)} label="Status">
                            <Option value={true}>Active</Option>
                            <Option value={false}>Inactive</Option>
                        </Select>
                    </div>
                    <div className="mb-4">
                        <Select value={formData.isGlobal} onChange={(value) => handleChangeCategory('isGlobal', value)} label="Type">
                            <Option value={true}>Global</Option>
                            <Option value={false}>Not Global</Option>
                        </Select>
                    </div>
                    {formData.isGlobal === false && (
                        <div className="mb-4 mt-12">
                            <h2 className="text-xl font-semibold mb-2">Select Products:</h2>
                            {formData.allProducts.map(product => (
                                <div key={product.id} className="flex items-center">
                                    <Checkbox
                                        id={`product-${product.id}`}
                                        checked={formData.productIds.includes(product.id)}
                                        onChange={() => handleCheckboxChange(product.id)}
                                    />
                                    <label htmlFor={`product-${product.id}`} className="ml-2">{product.name}</label>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="flex gap-5 justify-end">
                        <Button type="submit" color="blue">Add Promo</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPromoPage;
