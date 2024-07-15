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
        try {
            const response = await axiosInstance.post(
                "/api/threads/post-thread",
                {
                    ...newPostData,
                    media_url: newPostData.media_url?.[0] ?? null,
                    text: data.description,
                    access_token: threadsData.accessToken,
                    user_id: threadsData.userId,
                }
            );

            console.log(response.data.id);

            onPostChange({
                text: "",
                is_carousel_item: false,
                media_type: "TEXT",
                media_url: null,
            });
            setMediaUpload(null);
            reset();
            alert("Posted Successfully");
        } catch (error) {
            console.log(error);
            alert("Error Posting");
        }
    };

    useEffect(() => {
        if (mediaUpload !== null) {
            const uploadImageAndSetUrl = async () => {
                try {
                    setIsLoading(true);
                    const fileRef = ref(
                        storage,
                        `media/${mediaUpload.name} - ${uuidv4()}`
                    );
                    const snapshot = await uploadBytes(fileRef, mediaUpload);

                    const downloadURL = await getDownloadURL(snapshot.ref);
                    console.log(downloadURL);

                    const newPostData = { ...props.newPostData };
                    onPostChange({
                        ...newPostData,
                        media_url: [downloadURL],
                        media_type: mediaUpload.type.includes("image")
                            ? "IMAGE"
                            : "VIDEO",
                    });

                    setMediaUpload(null);
                } catch (error) {
                    console.error("Error uploading file:", error);
                } finally {
                    setIsLoading(false);
                }
            };

            uploadImageAndSetUrl();
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
                    <Controller
                        name="description"
                        control={control}
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

                {/* TODO: Media */}
                <div
                    className={`flex justify-start gap-4 mb-4 ${
                        mediaUpload !== null ? "cursor-not-allowed" : ""
                    }`}
                >
                    {/* Hidden file input */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
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
                            newPostData.media_url !== null
                                ? "cursor-not-allowed bg-gray-400 text-gray-800"
                                : "cursor-pointer bg-blue-200"
                        }`}
                    >
                        {newPostData.media_url !== null
                            ? "Image Uploaded"
                            : isLoading
                            ? "Uploading ..."
                            : "Upload Image"}
                        {isLoading && <Loading />}
                    </label>
                </div>

                {/* TODO: Location */}
                {/* TODO: Repeat Post */}

                <div className="flex justify-start">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Post Now
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;
