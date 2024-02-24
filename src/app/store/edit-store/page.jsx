"use client"
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Input, Button, Select, Option } from "@material-tailwind/react";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const EditStore = ({ searchParams }) => {
    const storeId = searchParams.id;
    const [value, setValue] = useState("");
    const [valueCity, setValueCity] = useState("");
    const [formData, setFormData] = useState({
        bankName: '',
        bankAccount: '',
        address: '',
        cityName: '',
        provinceName: '',
        cityId: '',
        provinceId: ''
    });
    const [cities, setCities] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetchStore();
        fetchProvinces();
    }, []);

    const fetchCities = async (provinceId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/order/cities/${provinceId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCities(response.data.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };
    const fetchStore = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/store/1`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const storeInfo = response.data.data
            setFormData({
                bankName: storeInfo.bankName,
                bankAccount: storeInfo.bankAccount,
                address: storeInfo.address,
                cityName: storeInfo.City.name,
                provinceName: storeInfo.Province.name,
                cityId: storeInfo.cityId,
                provinceId: storeInfo.provinceId
            });
            fetchCities(storeInfo.provinceId)
            setValue(storeInfo.Province.name)
            setValueCity(storeInfo.City.name)
        } catch (error) {
            console.error('Error fetching store:', error);
        }
    };
    const fetchProvinces = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/order/provinces`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProvinces(response.data.data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const handleChangeProvince = async (value) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}/order/province-id`, { name: value }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = response.data.data;
            console.log(data);
            setFormData(prevState => ({
                ...prevState,
                provinceName: value,
                provinceId: data
            }));
            fetchCities(data)
        } catch (error) {
            console.error('Error fetching province ID:', error);
            // Handle error appropriately
        }
    };
    const handleChangeCity = async (valueCity) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}/order/city-id`, { name: valueCity }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = response.data.data;
            console.log(data);
            setFormData(prevState => ({
                ...prevState,
                cityName: valueCity,
                cityId: data
            }));
        } catch (error) {
            console.error('Error fetching city ID:', error);
            // Handle error appropriately
        }
    };
    console.log(formData);
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.NEXT_PUBLIC_URL_BACKEND}/store/1`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Store updated successfully',
            }).then(() => {
                router.push('/store');
            });
        } catch (error) {
            console.error('Error updating store:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update store',
            });
        }
    };
    return (
        <div className='p-5'>
            <div className="p-8 w-[100%] h-[100%] mx-auto bg-white rounded-xl shadow-md overflow">
                <h1 className="text-2xl font-semibold mb-4">Edit Store</h1>
                <form onSubmit={handleSubmit} className=''>
                    <div className="mb-4">
                        <Input type="text" name="bankName" value={formData.bankName} onChange={handleChange} label="Bank Name" />
                    </div>
                    <div className="mb-4">
                        <Input type="text" name="bankAccount" value={formData.bankAccount} onChange={handleChange} label="Bank Account" />
                    </div>
                    <div className="mb-4">
                        <Input type="text" name="address" value={formData.address} onChange={handleChange} label="Address" />
                    </div>
                    {formData.provinceName != '' && (
                        <div className="mb-4">
                            <Select
                                value={value}
                                onChange={(value) => {
                                    handleChangeProvince(value);
                                }} name="province" label="Province">
                                {provinces.map(province => (
                                    <Option key={province.id} value={province.name}>{province.name}</Option>
                                ))}
                            </Select>
                        </div>
                    )}

                    {valueCity !== '' && (
                        <div className="mb-4">
                            <Select
                                value={valueCity}
                                onChange={(valueCity) => {
                                    handleChangeCity(valueCity);
                                }}
                                name="city"
                                label="City">
                                {cities.map(city => (
                                    <Option key={city.id} value={city.name}>{city.name}</Option>
                                ))}
                            </Select>
                        </div>
                    )}
                    <div className="flex gap-5 justify-end">
                        <Button type="submit" color="blue">Save Changes</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStore;
