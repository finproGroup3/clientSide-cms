"use client"
import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import Chart from 'chart.js/auto';
import Image from 'next/image';
import User from '../../img/user.svg';
import Item from '../../img/item.svg';
import Revenue from '../../img/revenue.svg';

const topBuyersColumns = [
    {
        title: 'No',
        dataIndex: 'no',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'User',
        dataIndex: 'username',
    },
    {
        title: 'Total Spending',
        dataIndex: 'totalNettPrice',
        render: (text) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(text),
    },
].map((column, index) => ({ ...column, key: index + 1 }));

const topProductsColumns = [
    {
        title: 'No',
        dataIndex: 'no',
        render: (text, record, index) => index + 1,
    },
    {
        title: 'Product',
        dataIndex: 'ProductName',
    },
    {
        title: 'Total Sold',
        dataIndex: 'TotalQuantitySold',
    },
].map((column, index) => ({ ...column, key: index + 1 }));


const Dashboard = () => {
    const [open, setOpen] = React.useState(false);
    const [topBuyers, setTopBuyers] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    useEffect(() => {
        const fetchTopBuyers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/order/top-buyers`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTopBuyers(response.data.data);
            } catch (error) {
                console.error('Error fetching top buyers:', error);
            }
        };

        const fetchTopProducts = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/order/top/product`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setTopProducts(response.data.data);
            } catch (error) {
                console.error('Error fetching top products:', error);
            }
        };

        fetchTopBuyers();
        fetchTopProducts();
    }, []);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            // Destroy the previous chart instance if it exists
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            // Create a new chart instance
            chartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // Updated labels
                    datasets: [
                        {
                            label: 'Revenue',
                            data: [65, 59, 80, 81, 56, 55, 40, 70, 65, 80, 85, 60], // Updated data for all twelve months
                            backgroundColor: 'rgba(49, 130, 206, 1)', // Set opacity to 1
                            borderColor: 'rgba(49, 130, 206, 1)',
                            borderWidth: 1,
                            borderRadius: 15,
                            barThickness: 20,
                        },
                    ],
                },
                options: {
                    scales: {
                        x: {
                            display: true,
                            grid: {
                                display: false,
                            },
                        },
                        y: {
                            display: true,
                            grid: {
                                display: false,
                            },
                        },
                    },
                },
            });
        }

        // Cleanup function to destroy the chart when the component unmounts
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className='p-5'>
            <div className="flex w-[100%] gap-[5%]">
                <div className='bg-white p-5 w-[65%] shadow-md h-[400px]'>
                    <canvas ref={chartRef} />
                </div>
                <div className="flex flex-col w-[35%] justify-between py-4">
                    <div className='flex justify-between p-5 bg-white shadow-lg rounded-md'>
                        <div>
                            <p>TOTAL USERS</p>
                            <p>2.503</p>
                        </div>
                        <Image src={User} alt="User" />
                    </div>
                    <div className='flex justify-between p-5 bg-white shadow-lg rounded-md'>
                        <div>
                            <p>TOTAL ITEMS SOLD</p>
                            <p>2.503</p>
                        </div>
                        <Image src={Item} alt="User" />
                    </div>
                    <div className='flex justify-between p-5 bg-white shadow-lg rounded-md'>
                        <div>
                            <p>TOTAL REVENUE</p>
                            <p>2.503</p>
                        </div>
                        <Image src={Revenue} alt="User" />
                    </div>
                </div>
            </div>

            <div className="flex gap-[6%] mt-[60px]">
                <div className='w-[100%]'>
                    <h1 className='font-thin text-2xl mb-4'>Top Buyer</h1>
                    <div className='shadow-md'>
                        <Table columns={topBuyersColumns}
                            dataSource={topBuyers}
                            pagination={false} />
                    </div>
                </div>
                <div className='w-[100%]'>
                    <h1 className='font-thin text-2xl mb-4'>Top Product Selling</h1>
                    <div className='shadow-md'>
                        <Table columns={topProductsColumns}
                            dataSource={topProducts}
                            pagination={false} />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
