import { toPng } from 'html-to-image';

/**
 * Step3Props: Interface for the final preview and export screen.
 * @property images - Array of base64 image strings passed from App.tsx.
 * @property templateId - Used to apply the correct CSS frame layout.
 * @property onBack - Function to return to the camera and reset state.
 */
interface Step3Props {
    images: string[];
    templateId: number;
    onBack: () => void;
}

export default function Step3({ images, templateId, onBack }: Step3Props) {
    /**
     * exportPolaroid: Captures the rendered HTML element and converts it to a PNG.
     */
    const exportPolaroid = async () => {
        // Find the specific div we want to turn into an image
        const el = document.getElementById('final-print');
        
        if (el) {
            /**
             * toPng: Converts the DOM node to a PNG data URL.
             * pixelRatio: 2 ensures the image is high-resolution (Retina quality),
             * otherwise the text and images might look blurry on modern screens.
             */
            const dataUrl = await toPng(el, { pixelRatio: 2 });
            
            // PROGRAMMATIC DOWNLOAD:
            // 1. Create a hidden <a> element
            const link = document.createElement('a');
            
            // 2. Set the filename with a timestamp to prevent overwriting files
            link.download = `polaroid-${Date.now()}.png`;
            
            // 3. Attach the generated image data
            link.href = dataUrl;
            
            // 4. Simulate a click to trigger the browser's download prompt
            link.click();
        }
    };

    return (
        <div className="step-content">
            <h2 className="step-title">Step 3: Save your picture!</h2>
            
            {/* THE EXPORT TARGET:
                This div (id="final-print") is what the html-to-image library looks for.
                We apply the same 'frame-{id}' class used in Step 1 to ensure the
                final layout matches the user's initial choice.
            */}
            
            <div id="final-print" className={`polaroid-frame frame-${templateId}`} style={{ width: '280px' }}>
                {images.map((src, i) => (
                    <div key={i} className="photo-slot">
                        {/* The captured photos are rendered as <img> tags inside 
                            the CSS-defined grid/stack. 
                        */}
                        <img src={src} alt="Captured" />
                    </div>
                ))}
            </div>

            <div className="btn-footer">
                {/* RETAKE: This button triggers setImages([]) in App.tsx, 
                    clearing the current gallery and returning to the camera.
                */}
                <button className="outline-btn" onClick={onBack}>Retake</button>
                
                {/* DOWNLOAD: Triggers the PNG generation logic above */}
                <button className="primary-btn" onClick={exportPolaroid}>Download PNG</button>
            </div>
        </div>
    );
}