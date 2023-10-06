import React, { useRef } from "react";
import Chat from "./Chat";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { Button } from "@chakra-ui/react";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode
);

const Sidebar = ({
  conn,
  chatText,
  setChatText,
  messages,
  files,
  setFiles,
  handleDataTransfer,
}) => {
  const filepondRef = useRef(null);

  const handleDownload = (fileItem) => {
    let file = new Blob([fileItem.file]);
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = fileItem.filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <section className="sidebar">
      <div className="file-input-container">
        <FilePond
          className="filepond"
          ref={filepondRef}
          credits={false}
          allowRemove={true}
          instantUpload={false}
          allowRevert={false}
          allowImagePreview={true}
          imagePreviewHeight={60}
          files={files}
          onupdatefiles={setFiles}
          allowMultiple={true}
          maxFiles={10}
          server={{
            process: (
              fieldName,
              file,
              metadata,
              load,
              error,
              progress,
              abort,
              transfer,
              options
            ) => {
              // fieldName is the name of the input field
              // file is the actual file object to send

              const pondFile = filepondRef.current.getFile();
              handleDataTransfer({
                type: "file",
                data: {
                  fileName: pondFile.filename,
                  file: pondFile.getFileEncodeDataURL(), // base64 string
                },
              });

              // Should call the progress method to update the progress to 100% before calling load
              // Setting computable to false switches the loading indicator to infinite mode
              progress(false, 0, 100);

              // Should call the load method when done and pass the returned server file id
              // this server file id is then used later on when reverting or restoring a file
              // so your server knows which file to return without exposing that info to the client
              load("file-id-here");
            },
          }}
          name="files" /* sets the file input name, it's filepond by default */
          labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
        />
        <Button
          size="sm"
          onClick={() => {
            const pondFiles = filepondRef.current.getFiles();
            // console.log(pondFiles);
            pondFiles.forEach((pondFile) => {
              handleDataTransfer({
                type: "file",
                data: {
                  fileName: pondFile.filename,
                  file: pondFile.getFileEncodeDataURL(), // base64 string
                },
              });
            });
          }}
          className="send-all"
        >
          Send All
        </Button>
      </div>

      <Chat
        conn={conn}
        chatText={chatText}
        setChatText={setChatText}
        messages={messages}
        files={files}
        setFiles={setFiles}
        handleDataTransfer={handleDataTransfer}
      />
    </section>
  );
};

export default Sidebar;
