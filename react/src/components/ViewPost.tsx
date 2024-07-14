import { useContext } from "react";
import { ThreadsContext } from "../providers/ContextProvider";
import { PostData } from "../App";

interface ViewPostProps {
    newPostData: PostData;
    onPostChange: () => void;
}

const ViewPost = (props: ViewPostProps) => {
    const { newPostData, onPostChange } = props;
    const { threadsData } = useContext(ThreadsContext);

    return (
        <div className="flex justify-center items-center h-full bg-gray-500">
            <div className="min-w-[300px] py-10 px-4 w-full min-h-[300px] bg-slate-100 m-16 rounded-lg">
                <div className="flex gap-4 h-full min-h-[300px]">
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
                            {newPostData.text &&
                            newPostData.text.length !== 0 ? (
                                newPostData.text.length > 500 ? (
                                    <span>
                                        {newPostData.text.substring(0, 500)}...
                                    </span>
                                ) : (
                                    newPostData.text
                                )
                            ) : (
                                "Start a thread..."
                            )}
                        </p>
                        {newPostData.media_type === "IMAGE" &&
                            newPostData.media_url !== null && (
                                <div className="flex justify-start gap-4 mb-4 border-2 relative border-black rounded-lg w-max">
                                    <p
                                        className="text-2xl font-bold absolute right-2 text-red-700 cursor-pointer"
                                        onClick={() => onPostChange()}
                                    >
                                        X
                                    </p>
                                    <img
                                        src={newPostData.media_url?.[0] ?? ""}
                                        alt="Media Preview"
                                        className="w-full h-full max-h-[300px]" // 16:9 Aspect Ratio
                                    />
                                </div>
                            )}
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
