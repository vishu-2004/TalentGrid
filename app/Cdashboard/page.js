"use client";
import { signOut } from "next-auth/react";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell } from '@fortawesome/free-solid-svg-icons';
import FButton from '@/components/Fbutton';
import Link from "next/link";
import { CDScard } from '@/components/CDScard';
import { CDMcard , plans} from '@/components/CDMcard';
import { CDLcard } from '@/components/CDLcard';


export default function Cdashboard() {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-6">Menu</h2>
                <nav className="space-y-2">
                    <Link href="#" className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg">
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/Cprofile" className="flex items-center space-x-2 text-gray-600 px-4 py-2 rounded-lg">
                        <span>Profile</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-900">Client Dashboard</h1>

                        {/* Search & Buttons */}
                        <div className="flex items-center space-x-4">
                            <div className="p-3 rounded-md border border-gray-300 flex items-center shadow-md w-[50vw]">
                                <FontAwesomeIcon icon={faSearch} className="text-gray-500 mr-3" />
                                <input
                                    type="text"
                                    className="w-full border-none focus:outline-none"
                                    placeholder="Search for jobs..."
                                />
                            </div>

                            {/* Sign Out Button */}
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                            >
                                logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {/* Overview Section */}
                    <div className="grid grid-cols-8 gap-0 sm:grid-cols-11 lg:grid-cols-1">
                        <CDScard />

                    </div>

                    {/* Middle Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          {plans.map((plan, index) => (
                              <CDMcard key={index} plan={plan} />
                          ))}
                    </div>

                    {/* Last Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <CDLcard />
                    </div>
                </div>
            </main>
        </div>
    );
}
