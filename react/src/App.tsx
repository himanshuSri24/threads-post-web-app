import { useContext, useState } from "react";
import CreatePost from "./components/CreatePost";
import ViewPost from "./components/ViewPost";
import InitAccessToken from "./components/InitAccessToken";
import { ThreadsContext } from "./providers/ContextProvider";

// Interfaces
export interface MediaUrl {
    url: string;
    type: string;
}
export interface PostData {
    text: string | null;
    is_carousel_item: boolean;
    media: MediaUrl[] | null;
}

// App Component
export const App = () => {
    const { threadsData } = useContext(ThreadsContext); // Context Provider
    const userName = threadsData?.userName ?? "";
    // initial post data
    const [newPostData, setNewPostData] = useState<PostData>({
        text: "",
        is_carousel_item: false,
        media: null,
    });
    // media upload state
    const [mediaUpload, setMediaUpload] = useState<File | null>(null);

    // handle removing an image from the post by clicking the x button
    const onImageRemove = (idx: number) => {
        console.log(idx);
        setNewPostData((prevState) => ({
            ...prevState,
            media: prevState.media
                ? prevState.media.filter((_, i) => i !== idx)
                : null,
        }));
        setMediaUpload(null);
    };

    return (
        <>
            {/* Component to initialize access token */}
            <InitAccessToken />
            {userName !== "" ? (
                <div className="xl:flex xl:justify-center min-h-screen">
                    <div className="flex justify-center w-full xl:w-3/5 bg-gray-300 p-4 xl:p-10">
                        <div className="m-2 xl:m-4 border w-full border-black rounded-sm xl:rounded-xl">
                            {/* Component to create a post */}
                            <CreatePost
                                onPostChange={setNewPostData}
                                newPostData={newPostData}
                                mediaUpload={mediaUpload}
                                setMediaUpload={setMediaUpload}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center w-full xl:w-2/5 bg-gray-500 p-4 xl:p-10">
                        <div className="m-2 xl:m-4 w-full rounded-sm xl:rounded-xl">
                            {/* Component to view a post */}
                            <ViewPost
                                newPostData={newPostData}
                                onPostChange={onImageRemove}
                            />
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
};
