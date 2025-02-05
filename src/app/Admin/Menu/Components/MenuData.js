"use client"
import React, { useState } from "react";
const MenuData = ({ data }) => {
    const { mainMenu, subMenu, linkMenu } = data;
    const [IsModel, setIsModel] = useState(false);

    const onCreate = () => {
        setIsModel(true);



    }

    const onEdit = (id) => { }
    const onDelete = (id) => { }

    return (
        <div className="p-4 relative">


            {
                IsModel && (

                    <div className=" w-full h-full">
                        <div className=" w-full items-end flex justify-end">
                            <button onClick={() => setIsModel(false)} className="px-4 py-2 bg-red-500 text-white rounded-md">Close</button>
                        </div>

                        <form>



                        </form>

                    </div>
                )
            }


            {/* Create Menu Button */}
            {
                !IsModel && (
                    <button
                        onClick={() => onCreate()}
                        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Create Main-Menu
                    </button>
                )}

            {
                !IsModel && (
                    <button
                        onClick={() => onCreate()}
                        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Create Sub-Menu
                    </button>
                )}


            {
                !IsModel && (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">S.No</th>
                                <th className="border border-gray-300 px-4 py-2">Main Menu</th>
                                <th className="border border-gray-300 px-4 py-2">Submenu</th>
                                <th className="border border-gray-300 px-4 py-2">Links</th>
                                <th className="border border-gray-300 px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mainMenu?.map((main, index) => (
                                <React.Fragment key={main.id}>
                                    {/* Main Menu Row */}
                                    <tr className="bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                                        <td className="border border-gray-300 px-4 py-2 font-bold">{main.title}</td>
                                        <td className="border border-gray-300 px-4 py-2 text-gray-400">-</td>
                                        <td className="border border-gray-300 px-4 py-2 text-gray-400">-</td>
                                        <td className="border border-gray-300 px-4 py-2 flex gap-2">
                                            <button
                                                onClick={() => onUpdate(main.id)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                                                Update
                                            </button>
                                            <button
                                                onClick={() => onDelete(main.id)}
                                                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Submenu Rows */}
                                    {subMenu
                                        .filter(sub => sub.main_menu_id === main.id)
                                        .map((sub, subIndex) => (
                                            <React.Fragment key={sub.id}>
                                                <tr className="bg-white">
                                                    <td className="border border-gray-300 px-4 py-2">{index + 1}.{subIndex + 1}</td>
                                                    <td className="border border-gray-300 px-4 py-2"></td>
                                                    <td className="border border-gray-300 px-4 py-2 font-medium">{sub.title}</td>
                                                    <td className="border border-gray-300 px-4 py-2 text-gray-400">-</td>
                                                    <td className="border border-gray-300 px-4 py-2 flex gap-2">
                                                        <button
                                                            onClick={() => onUpdate(sub.id)}
                                                            className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                                                            Update
                                                        </button>
                                                        <button
                                                            onClick={() => onDelete(sub.id)}
                                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>

                                                {/* Links Rows */}
                                                {linkMenu
                                                    .filter(link => link.sub_menu_id === sub.id)
                                                    .map((link, linkIndex) => (
                                                        <tr key={link.id} className="bg-gray-50">
                                                            <td className="border border-gray-300 px-4 py-2">{index + 1}.{subIndex + 1}.{linkIndex + 1}</td>
                                                            <td className="border border-gray-300 px-4 py-2"></td>
                                                            <td className="border border-gray-300 px-4 py-2"></td>
                                                            <td className="border border-gray-300 px-4 py-2">{link.name}</td>
                                                            <td className="border border-gray-300 px-4 py-2 flex gap-2">
                                                                <button
                                                                    onClick={() => onUpdate(link.id)}
                                                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">
                                                                    Update
                                                                </button>
                                                                <button
                                                                    onClick={() => onDelete(link.id)}
                                                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                                                                    Delete
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </React.Fragment>
                                        ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>
    );
};

export default MenuData;
