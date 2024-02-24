"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Select, Option } from "@material-tailwind/react";
import { Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Link from "next/link";

const AddProductPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        price: '',
        weight: '',
        stock: '',
        categoryId: '',
        images: [],
    });
    const [fileList, setFileList] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/category/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        setFormData({
            ...formData,
            categoryId: value,
        });
    };

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const onPreview = async (file) => {
        let src = file.url;
        if (!src && file.originFileObj) {
            src = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();

            formDataToSend.append('sku', formData.sku);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('weight', formData.weight);
            formDataToSend.append('stock', formData.stock);
            formDataToSend.append('categoryId', formData.categoryId);

            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formDataToSend.append('images', file.originFileObj);
                }
            });

            const token = localStorage.getItem('token');
            await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}/product/`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product added successfully',
            }).then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                    router.push('/product');
                }
            });
        } catch (error) {
            console.error('Error adding product:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add product',
            });
        }
    };

    return (
        <div className='p-5'>
            <div className="p-8 w-[100%] h-[100%] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <h1 className="text-2xl font-semibold mb-4">Add Product</h1>
                <form onSubmit={handleSubmit} className=''>
                    <div className="mb-4">
                        <Input type="text" name="sku" value={formData.sku} onChange={handleChange} label="Sku" />
                    </div>
                    <div className="mb-4">
                        <Input type="text" name="name" value={formData.name} onChange={handleChange} label="Name" />
                    </div>
                    <div className="mb-4">
                        <Input type="text" name="price" value={formData.price} onChange={handleChange} label="Price" />
                    </div>
                    <div className="mb-4">
                        <Input type="text" name="weight" value={formData.weight} onChange={handleChange} label="Weight" />
                    </div>
                    <div className="mb-4">
                        <Input type="text" name="stock" value={formData.stock} onChange={handleChange} label="Stock" />
                    </div>
                    <div className="mb-4">
                        <Select
                            label="Category"
                            onChange={(value) => handleCategoryChange(value)}
                        >
                            {categories.map(category => (
                                <Option key={category.id} value={category.id}>{category.name}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="mb-20">
                        <h2 className='mb-2 font-semibold text-lg'>Image Product</h2>
                        <ImgCrop rotationSlider>
                            <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onChange}
                                onPreview={onPreview}
                            >
                                {'+ Upload'}
                            </Upload>
                        </ImgCrop>
                    </div>
                    <div className="flex gap-5 justify-end">
                        <Link href='/product'>
                            <Button type="button" color="red">Cancel</Button>
                        </Link>
                        <Button type="submit" color="blue">Add Product</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductPage;
