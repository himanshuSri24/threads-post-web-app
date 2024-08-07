import { createContext, useState } from "react";

// Interfaces
interface IUser {
    userName: string | null;
    accessToken: string | null;
    profilePicture: string | null;
    userId: string | null;
}

interface IThreadsContext {
    threadsData: IUser;
    setThreadsData: (data: IUser) => void;
}

// Context Provider
export const ThreadsContext = createContext<IThreadsContext>({
    threadsData: {
        userName: null,
        accessToken: null,
        profilePicture: null,
        userId: null,
    },
    setThreadsData: () => {},
});

export const ThreadsContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    // default state
    const [threadsData, setThreadsData] = useState<IUser>({
        userName: null,
        accessToken: null,
        profilePicture: null,
        userId: null,
    });

    return (
        <ThreadsContext.Provider value={{ threadsData, setThreadsData }}>
            {children}
        </ThreadsContext.Provider>
    );
};
