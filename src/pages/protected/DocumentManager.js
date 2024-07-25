import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import DocumentManager from "../../features/documentmanager";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Document Manager" }));
  }, []);

  return <DocumentManager />;
}

export default InternalPage;
