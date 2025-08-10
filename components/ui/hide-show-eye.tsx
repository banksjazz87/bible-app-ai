"use client";

import { JSX } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

/**
 * HideShowEye component provides a button to toggle the visibility of a password input.
 * It uses FontAwesome icons for the eye and eye-slash icons to indicate visibility state.
 *
 * @param {boolean} showPassword - Indicates whether the password is currently visible.
 * @param {function} toggleShowPassword - Function to toggle the visibility of the password.
 * @returns {JSX.Element} The HideShowEye component.
 */
type HideShowEyeProps = {
	showPassword: boolean;
	toggleShowPassword: () => void;
};

export default function HideShowEye({ showPassword, toggleShowPassword }: HideShowEyeProps): JSX.Element {
	return (
		<button
			type="button"
			className="absolute right-2 top-1/2 -translate-y-1/2"
			onClick={toggleShowPassword}
		>
			<FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
		</button>
	);
}
