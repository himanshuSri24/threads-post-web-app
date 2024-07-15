import { useContext, useState } from "react";
import CreatePost from "./components/CreatePost";
import ViewPost from "./components/ViewPost";
import InitAccessToken from "./components/InitAccessToken";
import { ThreadsContext } from "./providers/ContextProvider";

export interface MediaUrl {
    url: string;
    type: string;
}
export interface PostData {
    text: string | null;
    is_carousel_item: boolean;
    media: MediaUrl[] | null;
}

export const App = () => {
    const { threadsData } = useContext(ThreadsContext);
    const userName = threadsData?.userName ?? "";
    const [newPostData, setNewPostData] = useState<PostData>({
        text: "",
        is_carousel_item: false,
        media: null,
    });
    const [mediaUpload, setMediaUpload] = useState<File | null>(null);

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
            <InitAccessToken />
            {userName !== "" ? (
                <div className="xl:flex xl:justify-center min-h-screen">
                    <div className="flex justify-center w-full xl:w-3/5 bg-gray-300 p-4 xl:p-10">
                        <div className="m-2 xl:m-4 border w-full border-black rounded-sm xl:rounded-xl">
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
