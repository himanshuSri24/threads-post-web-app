import { useRef } from "react";
import axios from "axios";
import axiosInstance from "../utils/AxiosConfig";

const CreatePost = () => {
    const userName = "Test User"; //TODO
    const descriptionRef = useRef<HTMLTextAreaElement>(null);

    const response = async (accessToken: string) => {
        try {
            const response = await axiosInstance.post("/api/threads/get-user", {
                access_token: accessToken,
            });
            console.log("User data from Threads API:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error;
        }
    };

    const onPost = async () => {
        response(
            "THQWJYVjQxYi1PeklNc2I5MGd2S1JLTWZAUZAHBsZAG1OeE5HLU1Rd1dPVkZAhWDZAYMmVZAZAmRpa1lFRl9sUXlTNzczWlVlOTVrYmlaaXBsUWxmT291WWlXeTZABZAXRZAeXFqOGdXM1ZAHOE9pQ1RoSlFLQ1BxNHlKVGFVbjhRSFEZD"
        );
    };

    const handlePost = () => {
        if (descriptionRef.current?.value !== "") {
            console.log(descriptionRef.current?.value);
            // TODO: Post to the backend
            const postData = {
                description: descriptionRef.current?.value,
                userName: userName,
                // TODO: Media
                // TODO: Location
                // TODO: Repeat Post
            };

            axios
                .post("/api/post", postData)
                .then((response) => {
                    console.log(response);
                    // TODO: Alert
                    alert("Posted Successfully");
                })
                .catch((error) => {
                    console.log(error);
                    // TODO: Alert
                    alert("Error Posting");
                });
        } else {
            // TODO: Alert
            alert("Please enter a description");
        }
    };

    return (
        <div className="m-2">
            <h1 className="text-2xl font-bold mb-4">Create Post for Threads</h1>
            <div className="text-lg font-bold mb-4">User: {userName}</div>
            <div>
                <p className="text-lg font-bold mb-4">Description:</p>
                <textarea
                    className="w-full h-32 border-2 border-black rounded-lg focus:border-blue-300 min-h-[25vh]"
                    ref={descriptionRef}
                ></textarea>
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
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={onPost}
                >
                    Post Now
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
