import React from "react";

const GoogleButton = () => {
    return (
        <div className="w-full flex justify-center">
            <button
                className="flex items-center gap-3 bg-white border border-gray-300 rounded-md px-4 py-2 shadow-sm hover:shadow-md transition duration-200 ease-in-out"
                onClick={() => console.log("Google sign-in clicked")}
            >
                {/* Google Icon */}
                <svg width="20" height="20" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285f4" d="M533.5 278.4c0-17.7-1.5-34.8-4.3-51.2H272v96.9h146.9c-6.3 33.9-25.2 62.6-53.9 81.9v68.1h87.3c51.1-47.1 80.2-116.5 80.2-195.7z"/>
                    <path fill="#34a853" d="M272 544.3c72.6 0 133.6-24.1 178.2-65.2l-87.3-68.1c-24.2 16.3-55.3 25.9-90.9 25.9-69.9 0-129.2-47.2-150.4-110.7h-89v69.6C85.1 478.5 171.5 544.3 272 544.3z"/>
                    <path fill="#fbbc04" d="M121.6 326.2c-10.1-30-10.1-62.4 0-92.4v-69.6h-89C-11.5 227.4-11.5 316.8 32.6 393.4l89-67.2z"/>
                    <path fill="#ea4335" d="M272 107.7c39.6-.6 77.6 13.9 107 40.3l80.1-80.1C417.5 24.8 346.6-2 272 0 171.5 0 85.1 65.8 43.6 161.8l89 69.6C142.8 154.9 202.1 107.7 272 107.7z"/>
                </svg>

                <span className="text-sm font-medium text-gray-700">
                    Sign in with Google
                </span>
            </button>
        </div>
    );
};

export default GoogleButton;
