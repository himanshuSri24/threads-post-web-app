import { useContext, useEffect, useState } from "react";
import { ThreadsContext } from "../providers/ContextProvider";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../utils/AxiosConfig";
import { storage } from "../utils/FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { PostData } from "../App";
import Loading from "./Loading";

const schema = z.object({
    description: z
        .string()
        .max(500, "Description must be 500 characters or less"),
});

type FormData = z.infer<typeof schema>;

interface CreatePostProps {
    onPostChange: (postData: PostData) => void;
    newPostData: PostData;
    mediaUpload: File | null;
    setMediaUpload: (mediaUpload: File | null) => void;
}

const CreatePost = (props: CreatePostProps) => {
    const { onPostChange, newPostData, mediaUpload, setMediaUpload } = props;
    const { threadsData } = useContext(ThreadsContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPosting, setIsPosting] = useState<boolean>(false);

    // zod validation schema + react-hook-form
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        console.log(data.description);
        setIsPosting(true);

        // Post can be of two types:
        // 1. Single Image / No Images
        // 2. Multiple Images

        if (newPostData.media !== null && newPostData.media.length >= 2) {
            // Multiple Images

            try {
                // call the API to post the thread for each image
                const promises = newPostData.media!.map(async (media) => {
                    const response = await axiosInstance.post(
                        "/api/threads/create-post-object",
                        {
                            media_url: media.url,
                            media_type: media.type,
                            text: data.description,
                            access_token: threadsData.accessToken,
                            user_id: threadsData.userId,
                        }
                    );
                    return response;
                });

                const responses = await Promise.allSettled(promises);

                const carouselPostIDs = responses
                    .filter((response) => response.status === "fulfilled")
                    .map((response) => response.value.data.id);

                console.log("MULTIPLE IMAGES", carouselPostIDs);

                const carouselPostIDsCommaSeperated = carouselPostIDs.join(",");

                // call the API to create the carousel container
                const responseCreateContainer = await axiosInstance.post(
                    "/api/threads/create-carousel-container",
                    {
                        text: data.description,
                        access_token: threadsData.accessToken,
                        user_id: threadsData.userId,
                        carouselIDsCommaSeperated:
                            carouselPostIDsCommaSeperated,
                    }
                );

                const carouselPostID = responseCreateContainer.data.id;

                // call the API to create the post
                const responseCreatePost = await axiosInstance.post(
                    "/api/threads/create-post",
                    {
                        access_token: threadsData.accessToken,
                        user_id: threadsData.userId,
                        postId: carouselPostID,
                    }
                );

                console.log("Response Created : ", responseCreatePost.data);

                // update the post data to empty
                onPostChange({
                    text: "",
                    is_carousel_item: false,
                    media: null,
                });
                setMediaUpload(null);
                reset();
                alert("Posted Successfully");
            } catch (error) {
                console.log(error);
                alert("Error Posting");
            } finally {
                setIsPosting(false);
            }
        } else {
            // Single Image / No Images
            try {
                console.log(newPostData.media);
                // call the API to create the post object
                const response = await axiosInstance.post(
                    "/api/threads/create-post-object",
                    {
                        media_url: newPostData.media?.[0].url ?? null,
                        media_type: newPostData.media?.[0].type ?? "TEXT",
                        text: data.description,
                        access_token: threadsData.accessToken,
                        user_id: threadsData.userId,
                        is_carousel_item: false,
                    }
                );

                console.log(response.data.id);

                // call the API to create the post
                const responseCreatePost = await axiosInstance.post(
                    "/api/threads/create-post",
                    {
                        access_token: threadsData.accessToken,
                        user_id: threadsData.userId,
                        postId: response.data.id,
                    }
                );

                console.log("Response Created : ", responseCreatePost.data);

                // update the post data to empty
                onPostChange({
                    text: "",
                    is_carousel_item: false,
                    media: null,
                });
                setMediaUpload(null);
                reset();
                alert("Posted Successfully");
            } catch (error) {
                console.log(error);
                alert("Error Posting");
            } finally {
                setIsPosting(false);
            }
        }
    };

    useEffect(() => {
        if (mediaUpload !== null) {
            // upload the media and set the url in the post data
            const uploadMediaAndSetUrl = async () => {
                try {
                    // set the loading state
                    setIsLoading(true);
                    // upload the media to Firebase Storage
                    const fileRef = ref(
                        storage,
                        `media/${mediaUpload.name} - ${uuidv4()}`
                    );
                    const snapshot = await uploadBytes(fileRef, mediaUpload);

                    const downloadURL = await getDownloadURL(snapshot.ref);
                    console.log(downloadURL);

                    // update the post data with the new media
                    const newPostData = { ...props.newPostData };
                    const newMedia = newPostData.media
                        ? [...newPostData.media]
                        : [];
                    newMedia.push({
                        url: downloadURL,
                        type: mediaUpload.type.includes("image")
                            ? "IMAGE"
                            : "VIDEO",
                    });
                    onPostChange({
                        ...newPostData,
                        media: newMedia,
                    });

                    // reset the media upload state
                    setMediaUpload(null);
                } catch (error) {
                    console.error("Error uploading file:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            uploadMediaAndSetUrl();
        }
    }, [mediaUpload, onPostChange, props.newPostData, setMediaUpload]);

    return (
        <div className="m-2">
            <h1 className="text-2xl font-bold mb-4">Create Post for Threads</h1>
            <div className="flex-col justify-start w-max">
                <img
                    src={threadsData.profilePicture ?? ""}
                    alt="User Image"
                    className="w-32 h-32 rounded-full"
                />
                <div className="text-lg font-bold mb-4 text-center">
                    {threadsData.userName}
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <p className="text-lg font-bold mb-4">
                        Description: ( 500 characters max )
                    </p>
                    {/* zod validation for the description field */}
                    <Controller
                        name="description"
                        control={control}
                        disabled={isPosting || isLoading}
                        defaultValue=""
                        render={({ field }) => (
                            <textarea
                                {...field}
                                className={`w-full h-32 border-2 border-black rounded-lg focus:border-blue-300 min-h-[25vh] ${
                                    errors.description ? "border-red-500" : ""
                                }`}
                                onChange={(e) => {
                                    field.onChange(e);
                                    onPostChange({
                                        ...newPostData,
                                        text: e.target.value,
                                    });
                                }}
                            />
                        )}
                    />
                    {errors.description && (
                        <p className="text-red-500">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div
                    className={`flex justify-start gap-4 mb-4 ${
                        mediaUpload !== null ? "cursor-not-allowed" : ""
                    }`}
                >
                    {/* Hidden file input */}
                    <input
                        type="file"
                        accept="image/*, video/*"
                        disabled={
                            isLoading ||
                            isPosting ||
                            (newPostData.media !== null &&
                                newPostData.media.length == 10)
                        }
                        onChange={(e) => {
                            if (
                                isLoading ||
                                (newPostData.media !== null &&
                                    newPostData.media.length == 10)
                            )
                                return;
                            const mediaToUpload = e.target.files?.[0] ?? null;
                            console.log(mediaToUpload, "mediaToUpload");
                            setMediaUpload(mediaToUpload);
                            e.target.value = "";
                        }}
                        style={{ display: "none" }}
                        id="upload-image-input"
                    />
                    {/* Button to trigger file input */}
                    <label
                        htmlFor="upload-image-input"
                        className={`border-2 border-black font-bold  flex gap-4 items-center min-h-[50px] py-2 px-4 rounded-lg  ${
                            isLoading ||
                            isPosting ||
                            (newPostData.media !== null &&
                                newPostData.media.length == 10)
                                ? "cursor-not-allowed bg-gray-400 text-gray-800"
                                : "cursor-pointer bg-blue-200"
                        }`}
                    >
                        {isLoading
                            ? "Uploading ..."
                            : newPostData.media !== null &&
                              newPostData.media.length == 10
                            ? "Max Images Reached"
                            : "Upload Media"}
                        {isLoading && <Loading />}
                    </label>
                </div>

                <div className="flex justify-start">
                    <button
                        disabled={isPosting || isLoading}
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        {isPosting ? (
                            <div className="flex justify-center items-center gap-4 cursor-not-allowed">
                                <span>Posting</span> <Loading />
                            </div>
                        ) : (
                            "Post Now"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
