import React, { useEffect, useState } from "react";
import { Loader } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';

function FaceLiveness({ faceLivenessAnalysis }) {
    const [loading, setLoading] = useState(true);
    const [sessionId, setSessionId] = useState(null);
    
    const endpoint = process.env.REACT_APP_ENV_API_URL || '';
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("X-API-KEY", "3646f320-aee6-452f-96f8-23718f3000b6");

    const raw = JSON.stringify({
        "reqToken": "89e35a68-0ce3-45e8-ae43-88d1f3776fbe"
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    useEffect(() => {
        const fetchCreateLiveness = async () => {
            try {
                console.log("Starting fetch...");
                const response = await fetch("https://ssiapi-staging.smartfalcon.io/liveness/create", requestOptions);
                console.log("Fetch response received...");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSessionId(data.sessionId);
                setLoading(false);
                console.log("Fetch success:", data);
            } catch (error) {
                console.error("Failed to create liveness session:", error);
                setLoading(false);
            }
        };
        fetchCreateLiveness();
    }, []);
    
    

    const handleAnalysisComplete = async () => {
        try {
            const response = await fetch("https://ssiapi-staging.smartfalcon.io/liveness/create", {
                method: 'POST',
                headers: {  
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionid: sessionId })
            });
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            faceLivenessAnalysis(data.body);
        } catch (error) {
            console.error("Failed to get liveness session results:", error);
        }
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : sessionId ? (
                <FaceLivenessDetector
                    sessionId={sessionId}
                    region="us-east-1"
                    onAnalysisComplete={handleAnalysisComplete}
                    onError={(error) => {
                        console.error(error);
                    }}
                />
            ) : (
                <p>Error: Unable to start the session. Please try again later.</p>
            )}
        </>
    );
}

export default FaceLiveness;
