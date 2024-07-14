import { useEffect } from "react";
import CreatePost from "./components/CreatePost";
import ViewPost from "./components/ViewPost";
import axiosInstance from "./utils/AxiosConfig";

export const App = () => {
    // useEffect(() => {
    //     // TODO: Get user from backend

    //     const response = async (accessToken: string) => {
    //         try {
    //             const response = await axiosInstance.post("/api/get-user", {
    //                 access_token: accessToken,
    //             });
    //             console.log("User data from Threads API:", response.data);
    //             return response.data;
    //         } catch (error) {
    //             console.error("Error fetching user data:", error);
    //             throw error;
    //         }
    //     };

    //     response(
    //         "THQWJYVjQxYi1PeklNc2I5MGd2S1JLTWZAUZAHBsZAG1OeE5HLU1Rd1dPVkZAhWDZAYMmVZAZAmRpa1lFRl9sUXlTNzczWlVlOTVrYmlaaXBsUWxmT291WWlXeTZABZAXRZAeXFqOGdXM1ZAHOE9pQ1RoSlFLQ1BxNHlKVGFVbjhRSFEZD"
    //     );
    // }, []);

    useEffect(() => {
        const greet = async () => {
            try {
                const response = await axiosInstance.get("/api/greet");
                console.log("Greet response:", response.data);
            } catch (error) {
                console.error("Error fetching greet response:", error);
                throw error;
            }
        };

        greet();
    }, []);

    return (
        <>
            <div className="xl:flex xl:justify-center h-screen">
                <div className="flex justify-center w-full xl:w-3/5 bg-gray-300 p-4 xl:p-10">
                    <div className="m-2 xl:m-4 border w-full border-black rounded-sm xl:rounded-xl">
                        <CreatePost />
                    </div>
                </div>
                <div className="flex justify-center w-full xl:w-2/5 bg-gray-100 p-4 xl:p-10">
                    <div className="m-2 xl:m-4 border w-full border-black rounded-sm xl:rounded-xl">
                        <ViewPost />
                    </div>
                </div>
            </div>
        </>
    );
};
