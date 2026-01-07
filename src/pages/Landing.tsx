import camera from "../assets/camera.svg";
import film from "../assets/film.svg";
import heart from "../assets/heart.svg";
import polaroid from "../assets/polaroid.svg";
import ribbon from "../assets/ribbon.svg";
import star from "../assets/star.svg";

/**
 * LandingProps: Defines the expected properties for the Landing component.
 * @property onStart - A callback function triggered when the user clicks the "Try it!" button.
 */
interface LandingProps {
    onStart: () => void;
}

/**
 * Landing Component: The welcome screen of the application.
 * Features a playful layout with scattered SVG icons and a call-to-action button.
 */
export default function Landing({ onStart }: LandingProps) {
    return (
        <div className="step-content">
            {/* DECORATIVE ELEMENTS:
                These images use the "deco" class, which (per your CSS) uses absolute positioning.
                This allows them to float behind or around the text without affecting the layout flow.
                The 'transform: rotate' adds a "scattered stickers" aesthetic.
            */}
            
            {/* Top-Left Star */}
            <img
                src={star}
                className="deco"
                style={{
                    top: "10%",
                    left: "10%",
                    width: "60px",
                    transform: "rotate(-10deg)",
                }}
                alt=""
            />
            
            {/* Top-Right Camera */}
            <img
                src={camera}
                className="deco"
                style={{
                    top: "15%",
                    left: "75%",
                    width: "60px",
                    transform: "rotate(15deg)",
                }}
                alt=""
            />
            
            {/* Center-Top Film Strip */}
            <img
                src={film}
                className="deco"
                style={{
                    top: "22%",
                    left: "40%",
                    width: "60px",
                    transform: "rotate(-5deg)",
                }}
                alt=""
            />
            
            {/* Center-Bottom Heart */}
            <img
                src={heart}
                className="deco"
                style={{
                    bottom: "22%",
                    right: "40%",
                    width: "70px",
                    transform: "rotate(10deg)",
                }}
                alt=""
            />
            
            {/* Bottom-Left Polaroid Frame */}
            <img
                src={polaroid}
                className="deco"
                style={{
                    bottom: "15%",
                    right: "75%",
                    width: "60px",
                    transform: "rotate(-10deg)",
                }}
                alt=""
            />
            
            {/* Bottom-Right Ribbon */}
            <img
                src={ribbon}
                className="deco"
                style={{
                    bottom: "10%",
                    right: "5%",
                    width: "80px",
                    transform: "rotate(-15deg)",
                }}
                alt=""
            />

            {/* MAIN TEXT: Centered title with a line break for readability */}
            <h1 className="step-title">
                Your polaroid is just <br /> 3 easy steps away!
            </h1>

            {/* ACTION BUTTON: Triggers the state change in App.tsx to move to Step 1 */}
            <button className="primary-btn" onClick={onStart}>
                Try it!
            </button>
        </div>
    );
}