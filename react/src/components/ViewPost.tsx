import { useContext } from "react";
import { ThreadsContext } from "../providers/ContextProvider";

interface ViewPostProps {
    description: string | null;
}

const ViewPost = (props: ViewPostProps) => {
    const { description } = props;
    const { threadsData } = useContext(ThreadsContext);

    return (
        <div className="flex justify-center items-center h-full bg-gray-500">
            <div className="min-w-[300px] py-10 px-4 w-full aspect-video bg-slate-100 m-16 rounded-lg">
                <div className="flex gap-4 h-full">
                    <img
                        src={threadsData.profilePicture ?? ""}
                        alt="User Image"
                        className="w-16 h-16 rounded-full"
                    />
                    <div className="w-full min-h-full">
                        <p className="pt-2 text-lg font-bold">
                            {threadsData.userName}
                        </p>
                        <p className="text-gray-600 break-all">
                            {description && description.length !== 0 ? (
                                description.length > 500 ? (
                                    <span>
                                        {description.substring(0, 500)}...
                                    </span>
                                ) : (
                                    description
                                )
                            ) : (
                                "Start a thread..."
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex justify-between items-center ml-4">
                    <p className="text-lg text-gray-500">
                        Anyone can reply and quote
                    </p>
                    <button
                        type="submit"
                        className="font-bold py-2 px-4 border-2 border-gray-400 rounded-lg text-gray-400"
                    >
                        Post Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewPost;
