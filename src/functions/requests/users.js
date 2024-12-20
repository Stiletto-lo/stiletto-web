import { getStoredItem, closeSession } from "../services";

export const getLearned = async () => {
  const token = getStoredItem("token");
  const discordId = getStoredItem("discordid");

  if (!token || !discordId) {
    return null;
  }

  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/users/${discordId}/tech`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status === 200) {
      return await response.json();
    }

    if (response.status === 401) {
      closeSession();
      throw new Error("You don't have access here, try to log in again");
    }

    if (response.status === 503) {
      throw new Error("Error connecting to database");
    }
  } catch (error) {
    throw new Error("Error when connecting to the API");
  }
};

export const addTech = async (tabSelect, learned) => {
  const discordId = getStoredItem("discordid");
  const token = getStoredItem("token");

  if (!token || !discordId || !tabSelect || !learned) {
    return;
  }

  try {
    const params = new URLSearchParams({
      tree: tabSelect,
    });

    const url = `${process.env.REACT_APP_API_URL
      }/users/${discordId}/tech?${params.toString()}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(learned),
    });

    if (response.status === 200) {
      window.location.reload();
    } else if (response.status === 401) {
      closeSession();
      throw new Error("You don't have access here, try to log in again");
    } else if (response.status === 503) {
      throw new Error("Error connecting to database");
    }
  } catch (error) {
    throw new Error("Error when connecting to the API");
  }
};
