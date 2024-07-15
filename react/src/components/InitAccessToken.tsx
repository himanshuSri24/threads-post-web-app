import { useState } from "react";
import axiosInstance from "../utils/AxiosConfig";
import { useContext } from "react";
import { ThreadsContext } from "../providers/ContextProvider";
import Loading from "./Loading";

const InitAccessToken = () => {
    const [accessToken, setAccessToken] = useState<string>("");
    const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { threadsData, setThreadsData } = useContext(ThreadsContext);

    const onConnectAccount = async () => {
        if (accessToken !== "") {
            try {
                setIsLoading(true);
                const response = await axiosInstance.post(
                    "/api/threads/get-user",
                    {
                        access_token: accessToken,
                    }
                );
                setThreadsData({
                    userName: response.data.username,
                    accessToken: accessToken,
                    profilePicture: response.data.threads_profile_picture_url,
                    userId: response.data.id,
                });
                setIsTokenValid(true);
            } catch (error) {
                console.error("Error fetching response:", error);
                throw error;
            } finally {
                setAccessToken("");
                setIsLoading(false);
            }
        } else {
            // TODO: Alert
            alert("Please enter an access token");
        }
    };

    const onDisconnectAccount = () => {
        setThreadsData({
            userName: null,
            accessToken: null,
            profilePicture: null,
            userId: null,
        });
        setIsTokenValid(false);
    };

    return (
        <div className="flex flex-col m-4">
            <label
                htmlFor="accessToken"
                className={`text-lg font-bold ${
                    (threadsData.accessToken !== null || isTokenValid) &&
                    "text-gray-500"
                }`}
            >
                Access Token:
            </label>
            <input
                className={`border-2 border-gray-800 rounded-lg focus:border-blue-300 mb-4 ${
                    (threadsData.accessToken !== null || isTokenValid) &&
                    "bg-gray-300 border-gray-300"
                }`}
                id="accessToken"
                type="text"
                value={accessToken}
                disabled={threadsData.accessToken !== null || isTokenValid}
                onChange={(e) => setAccessToken(e.target.value)}
            />
            <button
                className={` font-bold py-2 px-4 rounded-lg ${
                    threadsData.accessToken !== null || isTokenValid
                        ? "bg-gray-300 border-gray-300 text-black hover:bg-gray-400"
                        : "bg-blue-500 hover:bg-blue-700 text-white"
                }`}
                onClick={
                    !(threadsData.accessToken !== null || isTokenValid)
                        ? onConnectAccount
                        : onDisconnectAccount
                }
            >
                {!(threadsData.accessToken !== null || isTokenValid) ? (
                    isLoading ? (
                        <div className="flex justify-center items-center gap-4 cursor-not-allowed">
                            <span>Connecting Account</span> <Loading />
                        </div>
                    ) : (
                        "Connect Account"
                    )
                ) : (
                    "Account Connected. Click to Disconnect Account"
                )}
            </button>
        </div>
    );
};

export default InitAccessToken;
