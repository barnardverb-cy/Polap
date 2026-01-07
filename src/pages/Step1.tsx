import { useState } from 'react';

/**
 * Step1Props: Interface for the selection step.
 * @property onNext - Sends the selected template ID back to App.tsx.
 * @property onBack - Navigates user back to the Landing page.
 */
interface Step1Props {
    onNext: (id: number) => void;
    onBack: () => void;
}

/**
 * templates: Configuration array for the layout options.
 * 'slots' defines how many empty divs (photo-slots) will be rendered 
 * inside the visual preview.
 */
const templates = [
    { id: 1, slots: 1 }, 
    { id: 2, slots: 1 }, 
    { id: 3, slots: 1 },
    { id: 4, slots: 2 }, 
    { id: 5, slots: 3 },
    { id: 6, slots: 4 }
];

export default function Step1({ onNext, onBack }: Step1Props) {
    /**
     * sel: Local state to track which template is currently highlighted.
     * Defaults to the first template (id: 1).
     */
    const [sel, setSel] = useState<number>(1);

    return (
        <div className="step-content">
            <h2 className="step-title">Step 1: Choose your template</h2>
            
            <div className="template-grid">
                {templates.map(t => (
                    <div 
                        key={t.id} 
                        // Dynamic class: 'active' applies the highlight-blue border from CSS
                        className={`template-item ${sel === t.id ? 'active' : ''}`} 
                        onClick={() => setSel(t.id)}
                    >
                        {/* Display the template ID number in the top-left of the pink card */}
                        <span className="template-number">{t.id}</span>
                        
                        {/* Visual Preview:
                            The 'frame-{id}' class allows the CSS to apply specific aspect-ratios 
                            (1:1, 4:3, etc.) to the photo slots inside.
                        */}
                        <div className={`polaroid-frame frame-${t.id}`}>
                            {/* Generates an array based on the 'slots' count to render 
                                the correct number of empty boxes.
                            */}
                            {[...Array(t.slots)].map((_, i) => (
                                <div key={i} className="photo-slot" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="btn-footer">
                {/* Back button returns to Step 0 (Landing) */}
                <button className="outline-btn" onClick={onBack}>Back</button>
                
                {/* Next button passes the locally selected 'sel' ID 
                    to the parent App component's 'onNext' function.
                */}
                <button className="primary-btn" onClick={() => onNext(sel)}>Next</button>
            </div>
        </div>
    );
}