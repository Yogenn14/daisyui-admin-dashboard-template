import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";

import DocumentIcon from "@heroicons/react/24/solid/DocumentIcon";
import TabView from "../../features/docgenerator/TabView";

function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "Doc Generator" }));
  }, [dispatch]);

  return (
    <div className=" bg-base-200">
      <TabView />
    </div>
  );
}

export default InternalPage;
