"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Image } from 'antd';

const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const baseURL = 'http://localhost:3000/uploads/profile/';
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}/users/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const usersWithUpdateProfilePicture = response.data.data.map(user => ({
                    ...user,
                    profilePicture: baseURL + user.profilePicture
                }));
                setUsers(usersWithUpdateProfilePicture);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Profile Picture',
            dataIndex: 'profilePicture',
            key: 'profilePicture',
            render: (profilePicture) =>
                <Image
                    alt='profilePicture'
                    src={profilePicture}
                    width={50}
                />,
        },
    ].map((column, index) => ({ ...column, key: index + 1 }));

    return (
        <div className="p-5">
            <h1 className='text-2xl font-semibold text-white mb-9'>All User</h1>
            <div className='shadow-md'>
                <Table
                    dataSource={users}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={{ pageSize: 5 }}
                />
            </div>
        </div>
    );
};

export default UserPage;
