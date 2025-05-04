'use client';
import React from 'react';
import Head from 'next/head';
import { Sidebar } from '@components/navigation/Sidebar';
import { Header } from '@components/navigation/Header';
import { MainContent } from '@components/dashboard/MainContent';
import { useDashboardData } from '@hooks/useDashboardData';

export default function Dashboard() {
   const { taskGroups, activeTab, setActiveTab } = useDashboardData();

   return (
      <div className="min-h-screen bg-gray-50">
         <Head>
            <title>AutomatePro - Dashboard</title>
            <meta name="description" content="Project management dashboard" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
               {/* Header */}
               <Header breadcrumbs={['Projects', 'Adrian Bert - CRM Dashboard']} />

               {/* Main content area */}
               <MainContent
                  taskGroups={taskGroups}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
               />
            </div>
         </div>
      </div>
   );
}
