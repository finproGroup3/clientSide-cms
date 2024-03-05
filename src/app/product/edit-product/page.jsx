"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Select, Option } from "@material-tailwind/react";
import { Upload } from 'antd';
import Link from "next/link";
import ImgCrop from 'antd-img-crop';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const EditProductPage = ({ searchParams }) => {
    const router = useRouter();
    const productId = searchParams.id;
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        price: '',
        weight: '',
        stock: '',
        categoryId: '',
        images: [],
    });
    const [fileList, setFileList] = useState();
    const [categories, setCategories] = useState([]);
    const [value, setValue] = useState("");
    const fetchProductById = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/product/${productId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Map over the images array to store the mapped data in state
                const mappedImages = response.data.data.ProductGalleries.map(image => ({
                    uid: image.id.toString(), // Assuming image id is unique and can be converted to string
                    name: image.imageUrl, // You can provide any name here, like image name or just the URL
                    status: 'done',
                    url: `${process.env.NEXT_PUBLIC_URL_BACKEND}/uploads/productImage/${image.imageUrl}`,
                    // Add other properties as needed
                }));
                setFileList(mappedImages);
                setValue(response.data.data.Category.id.toString());
                // Set the fetched product data as initial form values
                setFormData({
                    sku: response.data.data.sku,
                    name: response.data.data.name,
                    price: response.data.data.price,
                    weight: response.data.data.weight,
                    stock: response.data.data.stock,
                    categoryId: response.data.data.Category.id,
                    destroyGallery: [],
                    ProductGalleries: mappedImages, // Store the mapped images in state
                });
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/category/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                // Convert id property to string for each category
                const categoriesWithStringIds = response.data.data.map(category => ({
                    ...category,
                    id: String(category.id)
                }));

                // Set categories state with fetched categories having string ids
                setCategories(categoriesWithStringIds);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
    useEffect(() => {
        fetchProductById();
        fetchCategories();
    }, [productId]);
    console.log(formData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleChangeCategory = (value) => {
        setFormData({
            ...formData,
            categoryId: value, // Assuming categoryId is the field you want to update
        });
    };
    const onChange = ({ fileList: newFileList }) => {
        // Flag variable to track if files were added or removed
        let filesAdded = false;

        // Find removed files
        const removedFiles = fileList.filter(file => !newFileList.some(newFile => newFile.uid === file.uid));
        // Check if any files were removed
        if (removedFiles.length > 0) {
            const removedFileUids = removedFiles.map(file => parseInt(file.uid, 10));
            // Push removed file uids to the destroyGallery array in formData
            setFormData(prevState => ({
                ...prevState,
                destroyGallery: [...prevState.destroyGallery, ...removedFileUids]
            }));
            // Update fileList state with the new file list
            setFileList(newFileList);
        } else {
            // Files were added
            filesAdded = true;
        }

        // If files were added, update formData
        if (filesAdded) {
            // Add files to formDataCopy
            const formDataCopy = { ...formData };
            const imageFiles = [];
            newFileList.forEach(file => {
                if (file.originFileObj) {
                    // Append file object to imageFiles array
                    imageFiles.push(file.originFileObj);
                }
            });

            // Append imageFiles array to formDataCopy with the key 'images'
            formDataCopy.images = imageFiles;

            // Update formData state with the appended files
            setFormData(formDataCopy);
        }

        // Update fileList state with the new file list
        setFileList(newFileList);
    };


    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
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
        e.preventDefault(); // Prevent the default form submission behavior

        try {
            const formDataToSend = new FormData(); // Create a new FormData object

            // Append form fields to formDataToSend
            formDataToSend.append('sku', formData.sku);
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('weight', formData.weight);
            formDataToSend.append('stock', formData.stock);
            formDataToSend.append('categoryId', formData.categoryId);

            // Append each file to formDataToSend
            fileList.forEach((file) => {
                // Check if originFileObj exists and is not null or undefined
                if (file.originFileObj) {
                    formDataToSend.append('images', file.originFileObj);
                }
            });

            // Append destroyGallery to formDataToSend
            formData.destroyGallery.forEach((galleryId) => {
                formDataToSend.append('destroyGallery', galleryId);
            });

            // Send formDataToSend to the API endpoint
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.NEXT_PUBLIC_URL_BACKEND}/product/${productId}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Set the content type to multipart form data
                },
            });
            // Show success message with SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product updated successfully',
            }).then((result) => {
                if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
                    router.push('/product');
                }
            });

        } catch (error) {
            console.error('Error updating product:', error);
            // Show error message with SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update product',
            });
        }
    };


    return (
        <div className='p-5'>
            <div className="p-8 w-[100%] h-[100%] mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
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
                        {value != "" && (
                            <Select
                                label="Category"
                                onChange={(val) => {
                                    setValue(val);
                                    handleChangeCategory(val);
                                }}
                            >
                                {categories.map(category => (
                                    <Option key={category.id} value={category.id}>{category.name}</Option>
                                ))}
                            </Select>
                        )}
                    </div>
                    <div className="mb-10">
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
                        <Button type="submit" color="blue">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductPage;
