import { useContext, useEffect, useState } from "react";
import CreatePost from "./components/CreatePost";
import ViewPost from "./components/ViewPost";
import axiosInstance from "./utils/AxiosConfig";
import InitAccessToken from "./components/InitAccessToken";
import { ThreadsContext } from "./providers/ContextProvider";

export const App = () => {
    const { threadsData } = useContext(ThreadsContext);
    const userName = threadsData?.userName ?? "";
    const [description, setDescription] = useState<string | null>(null);

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
            <InitAccessToken />
            {userName !== "" ? (
                <div className="xl:flex xl:justify-center h-screen">
                    <div className="flex justify-center w-full xl:w-3/5 bg-gray-300 p-4 xl:p-10">
                        <div className="m-2 xl:m-4 border w-full border-black rounded-sm xl:rounded-xl">
                            <CreatePost onDescriptionChange={setDescription} />
                        </div>
                    </div>
                    <div className="flex justify-center w-full xl:w-2/5 bg-gray-100 p-4 xl:p-10">
                        <div className="m-2 xl:m-4 border w-full border-black rounded-sm xl:rounded-xl">
                            <ViewPost description={description} />
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};
