import { useEffect, useState } from "react";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
);

// Our app
const FilePondUpload = ({ setFile, isMultiple = false, ...props }) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFile(isMultiple ? files?.map((file) => file?.file) : files?.[0]?.file);
  }, [files]);

  return (
    <FilePond
      {...props}
      files={files}
      onupdatefiles={setFiles}
      allowImageCrop={true}
      allowImageTransform={true}
      imageCropAspectRatio={"1:1"}
      allowMultiple={isMultiple}
      maxFiles={isMultiple ? 5 : 1}
      upload="false"
      instantUpload={false}
      credits={false}
      imagePreviewHeight={100}
      acceptedFileTypes={["image/png", "image/jpg", "image/jpeg"]}
      allowReorder={isMultiple}
      labelTapToCancel="İptal edin"
      labelTapToRetry="Tekrar deneyin"
      labelTapToUndo="Kapatmak için tıklayın"
      labelFileProcessing="Yükleniyor"
      labelFileProcessingError="Dosya yükleme başarısız"
      labelFileProcessingComplete="Başarıyla yüklendi"
      labelIdle="Dosya <span class='filepond--label-action'>Seçin</span> veya <span class='filepond--label-action'>Sürükleyin</span>"
      labelInvalidField="Geçersiz dosya içeriyor."
      labelFileWaitingForSize="Boyut bekleniyor"
      labelFileSizeNotAvailable="Boyut mevcut değil"
      labelFileLoading="Yükleniyor"
      labelFileLoadError="Yükleme sırasında hata"
      labelFileProcessingAborted="Yükleme iptal edildi"
      labelFileProcessingRevertError="Geri alma sırasında hata"
      labelFileRemoveError="Kaldırma sırasında hata"
      labelButtonRemoveItem="Kaldır"
      labelButtonAbortItemLoad="İptal et"
      labelButtonRetryItemLoad="Tekrar dene"
      labelButtonAbortItemProcessing="İptal et"
      labelButtonUndoItemProcessing="Geri al"
      labelButtonRetryItemProcessing="Tekrar dene"
      labelButtonProcessItem="Yükle"
    />
  );

  // const [field, state, { setValue }] = useField(props.field.name);

  // console.log(state);
  // return (
  //   <FilePond
  //     name="file"
  //     files={state?.value?.name || state?.value || []}
  //     onupdatefiles={(value) => setValue(value?.[0]?.file || "")}
  //     allowReorder={true}
  //     allowMultiple={true}
  //     maxFiles={3}
  //     upload="false"
  //     labelTapToCancel="İptal edin"
  //     labelTapToRetry="Tekrar deneyin"
  //     labelTapToUndo="Kapatmak için tıklayın"
  //     labelFileProcessing="Yükleniyor"
  //     labelFileProcessingError="Dosya yükleme başarısız"
  //     labelFileProcessingComplete="Başarıyla yüklendi"
  //     labelIdle='Dosya <span class="filepond--label-action">Seçin</span> veya <span class="filepond--label-action">Sürükleyin</span>'
  // // allowImageCrop
  // // allowImagePreview
  // // allowImageResize
  // // allowImageTransform
  // // stylePanelLayout="compact circle"
  // // styleLoadIndicatorPosition="center bottom"
  // // styleButtonRemoveItemPosition="center bottom"
  // // server={{
  // //   process: (fieldName, file, metadata, load, error, progress, abort) => {
  // //     load();
  // //   },
  // //   revert: null,
  // // }}
  //   />
  // );
};

export default FilePondUpload;
