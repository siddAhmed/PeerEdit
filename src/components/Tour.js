import Shepherd from "shepherd.js";
import "../../node_modules/shepherd.js/dist/esm/css/shepherd.css";
import { offset } from '@floating-ui/dom';
import './shepherd-progress.css';

const Tour = new Shepherd.Tour({
	exitOnEsc: true,
	useModalOverlay: false,
	defaultStepOptions: {
		classes: 'shepherd-theme-custom',
		cancelIcon: {
			enabled: true,
		},
		floatingUIOptions: {
			middleware: [offset({ mainAxis: 20, crossAxis: 0 })]
		}
	},

});

Tour.addStep({
	id: "welcome-step",
	title: "Welcome to PeerEdit!",
	text: "Get ready for a thrilling journey through our app. Use your ⇦ ⇨ keys to navigate and hit ESC to close this dialog. \nClick 'Next' to dive in!",
	buttons: [
		{
			text: "Next",
			action: Tour.next,
		},
	],
	// when: {
	// 	show() {
	// 		const currentStep = Shepherd.activeTour?.getCurrentStep();
	// 		const currentStepElement = currentStep?.getElement();
	// 		const header = currentStepElement?.querySelector('.shepherd-header');
	// 		const progress = document.createElement('span');
	// 		// progress.style['margin-right'] = '315px';
	// 		progress.innerText = `${Shepherd.activeTour?.steps.indexOf(currentStep) + 1}/${Shepherd.activeTour?.steps.length}`;
	// 		header?.insertBefore(progress, currentStepElement.querySelector('.shepherd-cancel-icon'));
	// 	}
	// }
});

Tour.addStep({
	id: "generate-id-step",
	title: "Creating a Peer ID",
	text: "Tap here to generate your unique peer ID. \nShare this ID with another PeerEdit instance, on a new tab or on device, and let the collaboration begin!",
	attachTo: {
		element: "#create-id",
		on: "right",
	},

	buttons: [
		{
			text: "Back",
			action: Tour.back,
		},
		{
			text: "Next",
			action: Tour.next,
		},
	]
});

Tour.addStep({
	id: "type-id-step",
	title: "Remote Peer ID",
	text: "Enter a remote peer ID here to connect to another PeerEdit instance. Press 'Connect' or hit Enter/Return to establish a connection.",
	attachTo: {
		element: "#id-input",
		on: "bottom",
	},
	buttons: [
		{
			text: "Back",
			action: Tour.back,
		},
		{
			text: "Next",
			action: Tour.next,
		},
	]
});

Tour.addStep({
	id: "connect-step",
	title: "Meet Your Peer",
	text: "Your connection peer IDs wil be displayed here.",
	attachTo: {
		element: ".local-peer-id",
		on: "right",
	},

	buttons: [
		{
			text: "Back",
			action: Tour.back,
		},
		{
			text: "Next",
			action: Tour.next,
		},
	],


});

Tour.addStep({
	id: "editor-step",
	title: "Rich Text Editor",
	text: "This is your canvas! Write text or code with syntax highlighting and autocompletion in multiple languages.",
	attachTo: {
		element: ".editor",
		on: "right",
	},

	buttons: [
		{
			text: "Back",
			action: Tour.back,
		},
		{
			text: "Next",
			action: Tour.next,
		},
	],
});

Tour.addStep({
	id: "language-selection-step",
	title: "Language Selection",
	text: "Specify the editor language here to tailor your writing experience.",
	attachTo: {
		element: "#language-select",
		on: "top",
	},

	buttons: [
		{
			text: "Back",
			action: Tour.back,
		},
		{
			text: "Next",
			action: Tour.next,
		},
	],


});

Tour.addStep({
	id: "format-step",
	title: "Beautify Your Code",
	text: "Click here to format your code in a snap!",
	attachTo: {
		element: "#prettify-btn",
		on: "top",
	},

	buttons: [
		{
			text: "Back",
			action: Tour.back,
		},
		{
			text: "Next",
			action: Tour.next,
		},
	],
});

Tour.addStep({
	id: "send-files-step",
	title: "File sharing",
	text: "Send multiple files at once or one at a time. You can browse for files or directly drag & drop them.",
	attachTo: {
		element: ".file-input-container",
		on: "left",
	},

	buttons: [
		{
			text: "Back",
			action: Tour.back,
		},
		{
			text: "Next",
			action: Tour.next,
		},
	],
});

Tour.addStep({
	id: "send-chat-step",
	title: "Let's Chat!",
	text: "Send messages to your peer and enjoy real-time communication.",
	attachTo: {
		element: ".chat-input",
		on: "left",
	},

	buttons: [
		{
			text: "Back",
			action: Tour.back,
		},
		{
			text: "Next",
			action: Tour.next,
		},
	],
});

Tour.addStep({
	id: "end-step",
	title: "That's a Wrap!",
	text: "You can revisit this tour anytime by clicking the question mark icon. \nEnjoy collaborating with PeerEdit!",
	attachTo: {
		element: ".help-icon",
		on: "left",
	},
	arrow: false,

	buttons: [
		{
			text: "Back",
			action: Tour.back,
		},
		{
			text: "End Tour",
			action: Tour.next,
		},
	],
});

export default Tour;