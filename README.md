# PeerEdit 

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Netlify Status](https://api.netlify.com/api/v1/badges/3d025355-529b-4828-ad47-060dd1d69900/deploy-status)](https://app.netlify.com/sites/peeredit/deploys) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Collaborate in real-time with PeerEdit** 

PeerEdit is a web app built with React, Monaco editor, and Peer.js. It allows users to connect with each other through peer-to-peer communication and collaborate in real-time. With a built-in rich text editor that supports syntax highlighting and suggestions, users can send code, files and messages to each other, similar to a chat room.

## Demo
<p align="center">
	<a href="https://www.youtube.com/watch?v=5MGJJXucBP4">
		<img src="https://img.youtube.com/vi/5MGJJXucBP4/0.jpg" alt="PeerEdit YouTube Demo">
	</a>
</p>

## Motivation
The inspiration for PeerEdit came from the constant struggle to share files and code snippets with classmates in computer labs. The process often involved signing in to public computers with WhatsApp or Google accounts, which posed a significant threat to privacy. To address this issue, PeerEdit was created. It allows users to connect peer-to-peer, without any server in between, eliminating the need for any persistent authentication. This ensures a secure and efficient way of sharing and collaborating on code in real-time.

## Installation
To use PeerEdit, follow these steps:

1. Clone the repository to your local machine.
```bash
git clone https://github.com/siddAhmed/PeerEdit.git
```
2. Navigate to the folder 
```bash
cd PeerEdit
```
3. Install the required dependencies
```bash
npm install
```
3. Start the development server
```bash
# Local Host
npm run dev
```
or

```bash
# Expose local host to local network & internet
npm run dev -- --host
```
4. Access the application in your browser at http://localhost:3000.

## Features
- **Peer-to-peer communication**: PeerEdit uses Peer.js to allow users to connect with each other and collaborate on coding projects in real-time.

- **Rich text editor**: The built-in Monaco editor for React supports syntax highlighting and suggestions for multiple languages.

- **File sharing**: Users can send code files to each other and collaborate on them in real-time.

- **Chat room**: Users can send short text messages to each other, similar to a chat room.

- **Code formatting**: PeerEdit uses prettify.js to allow users to format their code in multiple languages.

## Contributing
Contributions to PeerEdit are welcome and encouraged! If you would like to contribute to the project, please follow these steps:

1. Fork the repository to your own GitHub account.
2. Create a new branch with a descriptive name for your feature or bug fix.
3. Make your changes and commit them with descriptive commit messages.
4. Push your changes to your forked repository.
5. Create a pull request to merge your changes into the main branch of the PeerEdit repository.

## License
PeerEdit is licensed under the MIT License. 
