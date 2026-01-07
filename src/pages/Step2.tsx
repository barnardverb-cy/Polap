import { useEffect, useRef, useState } from "react";

/**
 * Step2Props: Interface for the camera interaction step.
 * @property templateId - Used to look up how many photos to take and the aspect ratio.
 * @property onNext - Sends the array of captured base64 images to App.tsx.
 * @property onBack - Returns user to Template Selection.
 */
interface Step2Props {
    templateId: number;
    onNext: (captured: string[]) => void;
    onBack: () => void;
}

/**
 * templateConfig: A mapping of Template IDs to the required number of captures.
 * This ensures the logic knows when to automatically progress to Step 3.
 */
const templateConfig: Record<number, number> = {
    1: 1, 2: 1, 3: 1, 
    4: 2, // 2 photos needed
    5: 3, // 3 photos needed
    6: 4, // 4 photos needed
};

export default function Step2({ templateId, onNext, onBack }: Step2Props) {
    // Reference to the hidden <video> element to access the camera stream
    const videoRef = useRef<HTMLVideoElement>(null);
    
    // Internal state to hold images as they are snapped
    const [captured, setCaptured] = useState<string[]>([]);
    
    // Determine the goal count based on the user's selection
    const slotsNeeded = templateConfig[templateId];

    // Load camera click sound effect
    const shutterSound = new Audio("/shutter.mp3");

    /**
     * CAMERA LIFECYCLE:
     * Starts the camera when the component mounts.
     * Stops the camera (cleanup) when the component unmounts.
     */
    useEffect(() => {
        // 1. Request access to the user's webcam
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                // Attach the live stream to our video element
                if (videoRef.current) videoRef.current.srcObject = stream;
            })
            .catch(console.error); // Handles "Permission Denied" errors

        // 2. IMPORTANT: Cleanup function. 
        // This stops the camera green light/usage when moving to Step 3 or back.
        return () => {
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach((t) => t.stop());
            }
        };
    }, []);

    /**
     * takePhoto: Handles the math for capturing exactly what the user sees in the 
     * preview box, ensuring "Object-Fit: Cover" logic is applied to the final image.
     */
    const takePhoto = () => {
        if (!videoRef.current) return;

        // Play sound feedback
        shutterSound.currentTime = 0; // Reset to start if clicking fast
        shutterSound.play();
        
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        
        // --- CROP CALCULATION ---
        // 1. Determine the "Shape" (Aspect Ratio) of the camera box in the UI
        const box = video.parentElement;
        if (!box) return;
        const boxWidth = box.clientWidth;
        const boxHeight = box.clientHeight;
        const targetRatio = boxWidth / boxHeight;
    
        // 2. Define Output Quality. 
        // We set a high base (1080px) and calculate height based on the ratio.
        canvas.width = 1080; 
        canvas.height = 1080 / targetRatio;
    
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
    
        // 3. APPLY MIRROR: 
        // Cameras look better mirrored for users, so we flip the horizontal axis.
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
    
        // 4. "OBJECT-FIT: COVER" MATH:
        // Since the camera stream might be 16:9 but our box is 1:1 (Square), 
        // we calculate how to center the capture and crop the edges.
        const videoRatio = video.videoWidth / video.videoHeight;
        let drawWidth, drawHeight, startX, startY;
    
        if (videoRatio > targetRatio) {
            // Stream is wider than UI box: Crop the sides
            drawHeight = canvas.height;
            drawWidth = canvas.height * videoRatio;
            startX = (canvas.width - drawWidth) / 2;
            startY = 0;
        } else {
            // Stream is taller than UI box: Crop the top/bottom
            drawWidth = canvas.width;
            drawHeight = canvas.width / videoRatio;
            startX = 0;
            startY = (canvas.height - drawHeight) / 2;
        }
    
        // 5. RENDER TO CANVAS: Draw the calculated frame
        ctx.drawImage(video, startX, startY, drawWidth, drawHeight);
    
        // 6. UPDATE STATE: Convert canvas to string (Data URL) and store it
        const dataUrl = canvas.toDataURL("image/png");
        const newImgs = [...captured, dataUrl];
        setCaptured(newImgs);
    
        // 7. AUTO-ADVANCE: Once all slots are full, wait a moment then move to Step 3
        if (newImgs.length === slotsNeeded) {
            setTimeout(() => onNext(newImgs), 500);
        }
    };

    return (
        <div className="step-content">
            {/* Header shows progress, e.g., (1/4) */}
            <h2 className="step-title">
                Step 2: Take your picture ({captured.length}/{slotsNeeded})
            </h2>

            {/* Camera Box: Its CSS aspect ratio changes based on templateId */}
            <div className={`camera-box frame-${templateId}`}>
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="video-feed"
                />
            </div>

            <div className="btn-footer">
                <button className="outline-btn" onClick={onBack}>
                    Back
                </button>
                <button className="primary-btn" onClick={takePhoto}>
                    Capture
                </button>
            </div>
        </div>
    );
}