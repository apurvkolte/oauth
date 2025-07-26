// src/pages/LinkedInCallback.jsx
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const LinkedInCallback = () => {
    const [params] = useSearchParams();

    useEffect(() => {
        const code = params.get("code");
        const error = params.get("error");

        if (window.opener) {
            // Send message back to main window
            if (code) {
                window.opener.postMessage(
                    { type: "LINKEDIN_AUTH_SUCCESS", code },
                    window.location.origin
                );
            } else if (error) {
                window.opener.postMessage(
                    { type: "LINKEDIN_AUTH_ERROR", error },
                    window.location.origin
                );
            }

            // Close popup
            window.close();
        }
    }, []);

    return <p>Authenticating with LinkedIn...</p>;
};

export default LinkedInCallback;
