'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Sidebar } from '@components/navigation/Sidebar';
import { Header } from '@components/navigation/Header';
import { MainContent } from '@components/dashboard/MainContent';

const pageBreadcrumbMap: Record<string, string[]> = {
   dashboard: ['Dashboard'],
   training: ['Models', 'Training'],
   logs: ['Models', 'Logs'],
   evaluate: ['Models', 'Evaluate & Chat'],
   todo: ['Tasks', 'To Do'],
   favorites: ['Datasets', 'Favorites'],
   uploads: ['Datasets', 'Uploads'],
   labeling: ['Datasets', 'Labeling'],
   created: ['Datasets', 'Created by me'],
   'project-1': ['Projects', 'Adrian Bert - CRM Dashboard'],
   'project-2': ['Projects', 'Trust - SaaS Dashboard'],
   'project-3': ['Projects', 'Pertamina Project'],
   'project-4': ['Projects', 'Garuda Project'],
   settings: ['Settings'],
   help: ['Help Center'],
};

const Dashboard = () => {
   const [activePage, setActivePage] = useState('dashboard');
   const [breadcrumbs, setBreadcrumbs] = useState<string[]>(['Dashboard']);
   const [notifications] = useState(2);

   useEffect(() => {
      const newBreadcrumbs = pageBreadcrumbMap[activePage] || ['Dashboard'];
      setBreadcrumbs(newBreadcrumbs);
   }, [activePage]);

   const handleNavigate = (page: string) => {
      setActivePage(page);
   };

   return (
      <div className="min-h-screen bg-gray-50">
         <Head>
            <title>AutomatePro - Dashboard</title>
            <meta name="description" content="Project management dashboard" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar onNavigate={handleNavigate} activePage={activePage} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
               {/* Header */}
               <Header breadcrumbs={breadcrumbs} notifications={notifications} />

               {/* Main content area */}
               <MainContent activePage={activePage} />
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
