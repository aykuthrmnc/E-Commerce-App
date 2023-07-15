import React, { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Col, Row } from "reactstrap";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "46px",
  padding: "0 18px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const PreviewDropzone = ({ onDropAccepted, ...props }) => {
  const [files, setFiles] = useState([]);
  const { acceptedFiles, fileRejections, getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  // const acceptedFileItems = acceptedFiles.map((file) => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));

  // const fileRejectionItems = fileRejections.map(({ file, errors }) => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //     <ul>
  //       {errors.map((e) => (
  //         <li key={e.code}>{e.message}</li>
  //       ))}
  //     </ul>
  //   </li>
  // ));

  return (
    <section>
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} {...props} />

        <p>Dosya Seçin veya Sürükleyin</p>
      </div>

      <Row className="align-items-center mt-3">
        {files?.map((file) => (
          <Col>
            <img
              src={file.preview}
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
              alt=""
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = process.env.REACT_APP_DEFAULT_IMAGE;
              }}
            />
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default PreviewDropzone;
