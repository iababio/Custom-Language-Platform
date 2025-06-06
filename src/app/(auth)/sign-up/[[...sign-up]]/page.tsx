'use client';

import { SignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useEffect } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
   const { isLoaded, isSignedIn } = useUser();
   const router = useRouter();

   useEffect(() => {
      if (isLoaded && isSignedIn) {
         router.push('/dashboard');
      }
   }, [isLoaded, isSignedIn, router]);

   return (
      <div className="min-h-screen flex flex-col md:flex-row">
         <div className="bg-red-800 md:w-1/2 p-8 flex flex-col justify-center items-center text-white">
            <div className="max-w-md mx-auto">
               <h1 className="text-3xl md:text-4xl font-bold mb-6">
                  Inter-Context Low Resource Language Learning
               </h1>
               <p className="text-xl mb-8">Train LLM to speak your local language.</p>
               <div className="bg-white/10 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">What you&apos;ll get</h2>
                  <ul className="space-y-3">
                     <li className="flex items-start">
                        <svg
                           className="h-6 w-6 mr-2 flex-shrink-0"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                           />
                        </svg>
                        <span>Keep track of language training tasks</span>
                     </li>
                     <li className="flex items-start">
                        <svg
                           className="h-6 w-6 mr-2 flex-shrink-0"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                           />
                        </svg>
                        <span>Import your language dataset</span>
                     </li>
                     <li className="flex items-start">
                        <svg
                           className="h-6 w-6 mr-2 flex-shrink-0"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke="currentColor"
                        >
                           <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                           />
                        </svg>
                        <span>Access advanced analysis features</span>
                     </li>
                  </ul>
               </div>
            </div>
            <div className="relative left-0 w-full flex justify-center">
               <Link
                  href="https://github.com/iababio/Custom-Language-Platform"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm my-20"
               >
                  <svg
                     viewBox="0 0 24 24"
                     aria-hidden="true"
                     className="h-5 w-5"
                     fill="currentColor"
                  >
                     <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                     />
                  </svg>
                  <span>Iababio: Github Code</span>
               </Link>
            </div>
         </div>

         <div className="md:w-1/2 p-8 flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md">
               <SignUp
                  appearance={{
                     elements: {
                        card: 'shadow-none',
                        formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                        footerActionLink: 'text-blue-600 hover:text-blue-800',
                     },
                  }}
                  redirectUrl="/dashboard"
               />
            </div>
         </div>
      </div>
   );
}
