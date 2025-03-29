import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { handleOAuthCallback, isAuthenticated } from "../services/AuthService";

function OAuthCallback({ setIsAuthenticated }) {
    const isProcessed = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function processOAuthResponse() {
            if (isProcessed.current) {
                return;
            }

            isProcessed.current = true;

            try {
                const currentUrl = window.location.href;
                await handleOAuthCallback(currentUrl);

                const authenticated = await isAuthenticated();
                setIsAuthenticated(authenticated);

                if (authenticated) {
                    navigate("/dashboard");
                }

            } catch (error) {
                console.error("Error processing OAuth callback:", error);
            }
        }

        processOAuthResponse();
    }, [setIsAuthenticated, navigate]);

    return null;
}

export default OAuthCallback;
