import React, { useState, useEffect } from "react";
import {
  FileBrowser,
  FileContextMenu,
  FileList,
  FileNavbar,
  FileToolbar,
  ChonkyActions,
} from "chonky";

function ExternalPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFolderPath, setCurrentFolderPath] = useState([]);

  useEffect(() => {
    // Fetch root folders initially
    fetchRootFolders();
  }, []);

  const fetchRootFolders = () => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:8083/api/folder/getRootFolders")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        const folders = data.rootFolders.map((folder) => ({
          id: folder.id,
          name: folder.title,
          isDir: true,
        }));
        setFiles(folders);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  };

  const handleFolderClick = async (event) => {
    const folderId = event.payload.file.id;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8083/api/folder/getAllSubFolderandFile/${folderId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subfolders and files");
      }
      const data = await response.json();
      const subfolders = data.subfolders.map((subfolder) => ({
        id: subfolder.id,
        name: subfolder.title,
        isDir: true,
      }));
      const folderFiles = data.files.map((file) => ({
        id: file.id,
        name: file.filename,
        isDir: false,
      }));
      const allItems = [...subfolders, ...folderFiles];
      setFiles(allItems);

      // Update current folder path
      setCurrentFolderPath((prevPath) => [...prevPath, event.payload.file]);
    } catch (error) {
      console.error("Error fetching subfolders and files:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBreadcrumbClick = (index) => {
    // Filter out folders after the clicked index to navigate back
    setCurrentFolderPath((prevPath) => prevPath.slice(0, index + 1));
    const folderId = currentFolderPath[index].id;

    // Fetch files and subfolders for the selected folder
    fetchFolderContent(folderId);
  };

  const fetchFolderContent = async (folderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8083/api/folder/getAllSubFolderandFile/${folderId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subfolders and files");
      }
      const data = await response.json();
      const subfolders = data.subfolders.map((subfolder) => ({
        id: subfolder.id,
        name: subfolder.title,
        isDir: true,
      }));
      const folderFiles = data.files.map((file) => ({
        id: file.id,
        name: file.filename,
        isDir: false,
      }));
      const allItems = [...subfolders, ...folderFiles];
      setFiles(allItems);
    } catch (error) {
      console.error("Error fetching subfolders and files:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCreateFolder = async () => {
    const folderName = prompt("Enter the name of the new folder:");
    if (!folderName) return; // Exit if the user cancels

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8083/api/folder/createFolder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ folderName }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create folder");
      }
      // Fetch the updated content after creating the folder
      fetchFolderContent(currentFolderPath[currentFolderPath.length - 1].id);
    } catch (error) {
      console.error("Error creating folder:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const myFileActions = [
    ChonkyActions.UploadFiles,
    ChonkyActions.DownloadFiles,
    ChonkyActions.CreateFolder,
  ];
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Chonky File Browser</h1>
      <FileBrowser
        files={files}
        onFileAction={handleFolderClick}
        fileActions={myFileActions}
      >
        <FileNavbar></FileNavbar>
        <FileToolbar>
          <button onClick={handleCreateFolder}>Create Folder</button>
        </FileToolbar>

        <FileList />
        <FileContextMenu />
        <CustomBreadcrumb
          currentFolderPath={currentFolderPath}
          onBreadcrumbClick={handleBreadcrumbClick}
        />
      </FileBrowser>
    </div>
  );
}

const CustomBreadcrumb = ({ currentFolderPath, onBreadcrumbClick }) => {
  return (
    <div>
      {currentFolderPath.map((folder, index) => (
        <span key={folder.id}>
          <button onClick={() => onBreadcrumbClick(index)}>
            {folder.name}
          </button>
          {index < currentFolderPath.length - 1 && " / "}
        </span>
      ))}
    </div>
  );
};

export default ExternalPage;
