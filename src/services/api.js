//CODE API FETCHING HERE[GET REQUEST]
const token = localStorage.getItem("token");

export const fetchInventoryData = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NODE_API_SERVER}inventory/getAll`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
};

export const fetchUserData = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_NODE_API_SERVER}user/userdata`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation", error);
    throw error;
  }
};
