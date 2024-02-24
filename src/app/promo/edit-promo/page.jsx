"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Select, Option } from "@material-tailwind/react";
import { Checkbox } from 'antd'
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const EditPromoPage = ({ searchParams }) => {
    const promoId = searchParams.id;
    const [formData, setFormData] = useState({
        code: '',
        percentage: '',
        quota: '',
        isActive: '',
        isGlobal: '',
        description: '',
        productIds: [],
        allProducts: [] // to store all products fetched from the API
    });

    const router = useRouter();


    const fetchPromoById = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/promo/${promoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const promoData = response.data.data;

            // Extract productIds from promoData and push them to formData.productIds
            const productIds = promoData.Products.map(product => product.id);
            setFormData(prevState => ({
                ...prevState,
                code: promoData.code,
                percentage: promoData.percentage,
                quota: promoData.quota,
                isActive: promoData.isActive,
                isGlobal: promoData.isGlobal,
                description: promoData.description,
                productIds: productIds, // Assign extracted productIds to formData.productIds
            }));
        } catch (error) {
            console.error('Error fetching promo:', error);
        }
    };

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
        fetchPromoById();
        fetchAllProducts();
    }, []);

    const handleChangeCategory = (name, value) => {
        setFormData(prevState => ({
            ...prevState,
            productIds: prevState.productIds || [],
            [name]: value,
        }));
    };

    console.log(formData);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            productIds: prevState.productIds || [], // Ensure productIds is always initialized
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
    console.log(formData);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.NEXT_PUBLIC_URL_BACKEND}/promo/${promoId}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Promo updated successfully',
            }).then(() => {
                router.push('/promo');
            });
        } catch (error) {
            console.error('Error updating promo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update promo',
            });
        }
    };
    return (
        <div className='p-5'>
            <div className="p-8 w-[100%] h-[100%] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <h1 className="text-2xl font-semibold mb-4">Edit Promo</h1>
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
                        <Button type="submit" color="blue">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default EditPromoPage;
