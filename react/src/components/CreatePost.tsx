import { useContext, useState } from "react";
import { ThreadsContext } from "../providers/ContextProvider";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axiosInstance from "../utils/AxiosConfig";

const schema = z.object({
    description: z
        .string()
        .max(500, "Description must be 500 characters or less"),
});

type FormData = z.infer<typeof schema>;

interface CreatePostProps {
    onDescriptionChange: (description: string | null) => void;
}

interface PostData {
    text: string | null;
    is_carousel_item: boolean;
    image_url: string | null;
    media_type: string;
    video_url: string | null;
}

const CreatePost = (props: CreatePostProps) => {
    const [newPostData, setNewPostData] = useState<PostData>({
        text: "",
        is_carousel_item: false,
        image_url: "",
        media_type: "TEXT",
        video_url: "",
    });

    const { onDescriptionChange } = props;
    const { threadsData } = useContext(ThreadsContext);
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
            await axiosInstance.post("/api/threads/post-thread", {
                ...newPostData,
                text: data.description,
                access_token: threadsData.accessToken,
                user_id: threadsData.userId,
            });

            // clear the description field
            setNewPostData({
                ...newPostData,
                text: "",
                is_carousel_item: false,
                image_url: "",
                media_type: "TEXT",
                video_url: "",
            });
            reset();
            onDescriptionChange(null);
            alert("Posted Successfully");
        } catch (error) {
            console.log(error);
            alert("Error Posting");
        }
    };

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
                                    setNewPostData({
                                        ...newPostData,
                                        text: e.target.value,
                                    });
                                    onDescriptionChange(e.target.value);
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
                {/* <div className="flex justify-start gap-4 mb-4">
                    <div>Media</div>
                    <div>Images</div>
                    <div>Videos</div>
                    <div>GIF</div>
                </div> */}

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
