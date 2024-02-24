"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button } from 'antd';
import Link from "next/link";
import Swal from 'sweetalert2';

const PromoPage = () => {
    const [promos, setPromos] = useState([]);

    const fetchPromos = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/promo/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPromos(response.data.data);
        } catch (error) {
            console.error('Error fetching promos:', error);
        }
    };

    useEffect(() => {
        fetchPromos();
    }, []);

    const handleDelete = async (promo) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.NEXT_PUBLIC_URL_BACKEND}/promo/deactivate/${promo.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchPromos();
        } catch (error) {
            console.error('Error deleting promo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to delete promo',
            });
        }
    };


    const handleActivate = async (promo) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${process.env.NEXT_PUBLIC_URL_BACKEND}/promo/activate/${promo.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            Swal.fire(
                'Activated!',
                'Promo has been activated.',
                'success'
            );
            fetchPromos();
        } catch (error) {
            console.error('Error activating promo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to activate promo',
            });
        }
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
        },
        {
            title: 'Quota',
            dataIndex: 'quota',
            key: 'quota',
        },
        {
            title: 'Type',
            dataIndex: 'isGlobal',
            key: 'isGlobal',
            render: (isGlobal) => (isGlobal ? 'Global' : 'Not Global'),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (isActive) => (isActive ? 'Active' : 'Inactive'),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                <div className='flex gap-4'>
                    <Link href={{
                        pathname: '/promo/edit-promo',
                        query: {
                            id: record.id
                        }
                    }}>
                        <Button type="primary" primary className='button'>Edit</Button>
                    </Link>
                    <Button type="primary" danger className='danger' onClick={() => handleDelete(record)}>Deactivate</Button>
                    <Button type="primary" className='danger' onClick={() => handleActivate(record)}>Activate</Button>
                </div>
            ),
        },
    ].map((column, index) => ({ ...column, key: index + 1 }));

    return (
        <div className='p-5'>
            <div className="flex justify-between">
                <h1>Promos</h1>
                <Link href="/promo/add-promo">
                    <Button type="primary" color="blue">+ Add Promo</Button>
                </Link>
            </div>
            <div className='shadow-md'>
                <Table
                    pagination={{ pageSize: 5 }}
                    dataSource={promos}
                    columns={columns}
                    rowKey="id"
                />
            </div>
        </div>
    );
};

export default PromoPage;
