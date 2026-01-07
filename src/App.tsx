import { useState } from "react";
import Landing from "./pages/Landing";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";

/**
 * App Component: The central "Brain" of the application.
 * It manages the navigation state and stores data collected from each step.
 */
function App() {
    // Current screen index (0: Landing, 1: Selection, 2: Camera, 3: Final)
    const [step, setStep] = useState(0);

    // Stores the user's selected layout ID (1 through 6)
    const [templateId, setTemplateId] = useState(1);

    // Stores the array of base64 image strings captured in Step 2
    const [images, setImages] = useState<string[]>([]);

    return (
        <div className="app-container">
            {/* STEP 0: LANDING PAGE 
                Initial entry point. Simply triggers the move to Step 1.
            */}
            {step === 0 && <Landing onStart={() => setStep(1)} />}

            {/* STEP 1: TEMPLATE SELECTION 
                Receives the 'id' from the child component and updates templateId.
            */}
            {step === 1 && (
                <Step1
                    onNext={(id: number) => {
                        setTemplateId(id);
                        setStep(2); // Move to Camera
                    }}
                    onBack={() => setStep(0)}
                />
            )}

            {/* STEP 2: CAMERA CAPTURE 
                Passes the templateId so the camera knows the crop ratio and photo count.
                Stores the returned array of captured images in state.
            */}
            {step === 2 && (
                <Step2
                    templateId={templateId}
                    onNext={(captured: string[]) => {
                        setImages(captured);
                        setStep(3); // Move to Save screen
                    }}
                    onBack={() => setStep(1)}
                />
            )}

            {/* STEP 3: FINAL EXPORT 
                Displays the images inside the chosen Polaroid frame.
                Clears the image array if the user decides to go back and retake photos.
            */}
            {step === 3 && (
                <Step3
                    images={images}
                    templateId={templateId}
                    onBack={() => {
                        setImages([]); // Reset images to prevent gallery overlap
                        setStep(2);    // Return to Camera
                    }}
                />
            )}
        </div>
    );
}

export default App;