"use client"
import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import Link from "next/link";
import Hashids from 'hashids'

const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
};

const Page = () => {
    const hashids = new Hashids()
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [allProducts, setAllProducts] = useState([]);
    const fetchAllProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/product/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Adjust the structure of the data
            const adjustedData = response.data.data.map(product => {
                return {
                    ...product,
                    categoryName: product.Category.name
                };
            });
            console.log(adjustedData);
            setAllProducts(adjustedData);
        } catch (error) {
            console.error('Error fetching top products:', error);
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const handleDelete = async (record) => {
        console.log(record.id);
        try {
            const confirmed = await Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this product!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            });

            if (confirmed.isConfirmed) {
                const token = localStorage.getItem('token');
                await axios.delete(`${process.env.NEXT_PUBLIC_URL_BACKEND}/product/${record.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // If deletion is successful, show success alert
                Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
                // Refresh the product list
                fetchAllProducts();
            } else if (confirmed.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Your product is safe :)', 'info');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            // Show error alert
            Swal.fire('Error', 'An error occurred while deleting the product.', 'error');
        }
    };


    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.weight - b.weight,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.stock - b.stock,
        },
        {
            title: 'Category',
            dataIndex: 'categoryName',
            filters: [
                {
                    text: 'elektronik',
                    value: 'elektronik',
                },
                {
                    text: 'baju',
                    value: 'baju',
                },
            ],
            onFilter: (value, record) => record.categoryName.toLowerCase().includes(value.toLowerCase()),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text, record) => (
                <div className='flex gap-4'>
                    <Link href={{
                        pathname: '/product/edit-product',
                        query: {
                            id: record.id
                        }
                    }}>
                        <Button type="primary" primary className='button'>Edit</Button>
                    </Link>
                    <Button type="primary" danger className='danger' onClick={() => handleDelete(record)}>Delete</Button>
                </div>
            ),
        },
    ].map((column, index) => ({ ...column, key: index + 1 }));

    return (
        <div className='p-5'>
            <div className='flex justify-between'>
                <h1 className='text-2xl font-semibold'>All Products</h1>
                <Link href="/product/add-product">
                    <Button type="primary" color="blue">+ Add Product</Button>
                </Link>
            </div>
            <div className='shadow-md mt-5'>
                <Table
                    columns={columns}
                    dataSource={allProducts}
                    onChange={onChange}
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </div>
    )
}

export default Page