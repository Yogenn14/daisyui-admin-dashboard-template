import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import FoldersList from "../../features/folderdetails";
import { useParams } from "react-router-dom";

function InternalPage() {
  const dispatch = useDispatch();
  const { folderId } = useParams();
  useEffect(() => {
    dispatch(setPageTitle({ title: "Document Manager" }));
  }, []);

  return <FoldersList folderId={folderId} />;
}

export default InternalPage;
