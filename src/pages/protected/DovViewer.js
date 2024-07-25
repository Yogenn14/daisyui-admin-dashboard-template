import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function App() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const filePath = queryParams.get("filePath");

  useEffect(() => {
    console.log("file path", filePath);
  }, [filePath]);

  let decodedFilePath = decodeURIComponent(filePath);

  return (
    <div className="App">
      <DocViewer
        documents={[
          {
            uri: `${process.env.REACT_APP_SERVER_BASE_URL}/${decodedFilePath}`,
          },
        ]}
        pluginRenderers={DocViewerRenderers}
      />
    </div>
  );
}
