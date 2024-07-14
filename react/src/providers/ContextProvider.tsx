import { createContext, useState } from "react";

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

// export const useUserContextProvider = () => useContext(UserContext);
