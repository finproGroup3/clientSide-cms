"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Table, Button, Image } from 'antd';

const OrderPage = () => {
    const [orders, setOrders] = useState([]);
    const token = localStorage.getItem('token');
    const baseURL = 'http://localhost:3000/uploads/paymentBills/';
    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/order/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data.data);
            const ordersWithUpdatedPaymentBills = response.data.data.map(order => ({
                ...order,
                paymentBill: baseURL + order.paymentBill
            }));
            setOrders(ordersWithUpdatedPaymentBills);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    console.log(orders);
    useEffect(() => {
        fetchOrders();
    }, [token]);
    const formatIDR = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };
    const handleAccept = async (id) => {
        const confirmed = await Swal.fire({
            icon: 'question',
            title: 'Confirmation',
            text: 'Are you sure you want to accept this order?',
            showCancelButton: true,
            confirmButtonText: 'Yes, accept it',
            cancelButtonText: 'No, cancel',
        });

        if (confirmed.isConfirmed) {
            try {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_URL_BACKEND}/order/${id}/status`, { status: 'succeed' }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Order accepted:', response.data);
                // Refresh orders after accepting
                fetchOrders();
                // Show success notification
                Swal.fire({
                    icon: 'success',
                    title: 'Order Accepted',
                    text: 'The order has been accepted successfully.',
                });
            } catch (error) {
                console.error('Error accepting order:', error);
                // Show error notification
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to accept the order. Please try again later.',
                });
            }
        }
    };

    const handleReject = async (id) => {
        const confirmed = await Swal.fire({
            icon: 'question',
            title: 'Confirmation',
            text: 'Are you sure you want to reject this order?',
            showCancelButton: true,
            confirmButtonText: 'Yes, reject it',
            cancelButtonText: 'No, cancel',
        });

        if (confirmed.isConfirmed) {
            try {
                const response = await axios.put(`${process.env.NEXT_PUBLIC_URL_BACKEND}/order/${id}/status`, { status: 'rejected' }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Order rejected:', response.data);
                // Refresh orders after rejecting
                fetchOrders();
                // Show success notification
                Swal.fire({
                    icon: 'success',
                    title: 'Order Rejected',
                    text: 'The order has been rejected successfully.',
                });
            } catch (error) {
                console.error('Error rejecting order:', error);
                // Show error notification
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to reject the order. Please try again later.',
                });
            }
        }
    };

    const columns = [
        {
            title: 'No',
            width: 100,
            dataIndex: 'no',
            fixed: 'left',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'User',
            width: 100,
            dataIndex: ['User', 'username'],
            key: 'username',
            fixed: 'left',
        },
        {
            title: 'Promo Name',
            width: 150,
            dataIndex: ['Promo', 'description'],
            key: 'promoName',
            render: (promoName) => promoName || '-',
        },
        {
            title: 'Total Promo',
            width: 150,
            dataIndex: 'totalDiscount',
            key: 'totalDiscount',
            render: (totalDiscount) => formatIDR(totalDiscount),
        },
        {
            title: 'Total Affiliate',
            width: 150,
            dataIndex: 'totalAffiliate',
            key: 'totalAffiliate',
            render: (totalAffiliate) => formatIDR(totalAffiliate),
        },
        {
            title: 'Nett Price',
            width: 150,
            dataIndex: 'nettPrice',
            key: 'nettPrice',
            render: (nettPrice) => formatIDR(nettPrice),
        },
        {
            title: 'Shipping Cost',
            width: 150,
            dataIndex: 'shippingCost',
            key: 'shippingCost',
            render: (shippingCost) => formatIDR(shippingCost),
        },
        {
            title: 'Total Price',
            width: 150,
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (totalPrice) => formatIDR(totalPrice),
        },
        {
            title: 'Payment Bills',
            dataIndex: 'paymentBill',
            width: 150,
            render: (paymentBill) => {
                if (paymentBill.slice(-4) === 'null') {
                    return <p>-</p>;
                } else {
                    return (
                        <div>
                            <Image
                                alt='-'
                                width={80}
                                src={paymentBill}
                            />
                        </div>
                    );
                }
            },
        },
        {
            title: 'Status',
            width: 100,
            fixed: 'right',
            dataIndex: 'status',
            key: 'status',
            filters: [
                {
                    text: 'succeed',
                    value: 'succeed',
                },
                {
                    text: 'rejected',
                    value: 'rejected',
                },
                {
                    text: 'pending',
                    value: 'pending',
                },
            ],
            onFilter: (value, record) => record.status.toLowerCase().includes(value.toLowerCase()),
            render: (status) => (
                <span style={{ color: status === 'rejected' ? 'red' : status === 'succeed' ? 'green' : 'grey', fontWeight: 600 }}>
                    {status}
                </span>
            ),
        },
        {
            title: 'Action',
            fixed: 'right',
            width: 250,
            dataIndex: 'action',
            render: (text, record) => {
                const isPending = record.status == 'pending';
                return (
                    <div className='flex gap-4'>
                        <Button type="primary" primary className='button' disabled={!isPending} onClick={() => handleAccept(record.id)}>Accept</Button>
                        <Button type="primary" danger className='danger' disabled={!isPending} onClick={() => handleReject(record.id)}>Reject</Button>
                    </div>
                );
            },
        },

    ].map((column, index) => ({ ...column, key: index + 1 }));

    return (
        <div className='p-5'>
            <h1 className='text-2xl font-semibold text-white mb-9'>All Order</h1>
            <div className='w-[1150px]'>
                <Table dataSource={orders} columns={columns} scroll={{
                    x: 300,
                }} />
            </div>
        </div>
    );
};

export default OrderPage;
