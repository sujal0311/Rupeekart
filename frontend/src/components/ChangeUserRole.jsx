import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { toast } from 'react-toastify';
import SummaryApi from '../common/index';
import ROLE from '../common/role';
import {Button} from '@mui/material';
const ChangeUserRole = ({
    name,
    email,
    role,
    userId,
    onClose,
    callFunc,
}) => {
    const [userRole, setUserRole] = useState(role);

    const handleOnChangeSelect = (e) => {
        setUserRole(e.target.value);
        console.log(e.target.value);
    };

    const updateUserRole = async () => {
        console.log(userId);
        console.log(userRole);
        const fetchResponse = await fetch(SummaryApi.updateUser.url, {
            method: SummaryApi.updateUser.method,
            credentials: 'include',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                role: userRole
            })
        });

        const responseData = await fetchResponse.json();

        if (responseData.success) {
            toast.success(responseData.message);
            onClose();
            callFunc();
        }

        console.log("role updated", responseData);
    };

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 w-full h-full z-10 flex justify-between items-center bg-slate-200 bg-opacity-50'>
            <div className='mx-auto bg-white shadow-md p-4 w-full max-w-sm'>
                <button className='block ml-auto' onClick={onClose}>
                    <IoMdClose />
                </button>
                <h1 className='pb-4 text-lg font-medium'>Change User Role</h1>
                <p>Name : {name}</p>   
                <p>Email : {email}</p> 
                <div className='flex items-center justify-between my-4'>
                    <p>Role :</p>  
                    <select className='border px-4 py-1' value={userRole} onChange={handleOnChangeSelect}>
                        {
                            Object.values(ROLE).map(el => (
                                <option value={el} key={el}>{el}</option>
                            ))
                        }
                    </select>
                </div>
                <div className='flex justify-center'><Button variant='contained' onClick={updateUserRole}>Change Role</Button></div>
            </div>
        </div>
    );
};

export default ChangeUserRole;
